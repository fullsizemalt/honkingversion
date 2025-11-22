"""
Bulk population script: Fetch Goose shows from El Goose API and populate database.

This is a ONE-TIME operation to populate the database with historical show data.
After initial population, shows are updated on-demand as users view them.

Usage:
    python seed_from_elgoose.py [--start YYYY-MM-DD] [--end YYYY-MM-DD] [--limit N]

Examples:
    python seed_from_elgoose.py                              # Default: last 365 days
    python seed_from_elgoose.py --start 2020-01-01           # From 2020 to today
    python seed_from_elgoose.py --start 2016-01-01 --end 2024-01-01  # Specific range
    python seed_from_elgoose.py --limit 50                   # First 50 shows only (testing)
"""

import requests
import json
import sys
from datetime import datetime, timedelta
from sqlmodel import Session, select
from database import engine, create_db_and_tables
from models import Show, Song, SongPerformance
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

EL_GOOSE_BASE_URL = "https://elgoose.net/api/v2"
BATCH_SIZE = 10  # Days per batch to avoid overwhelming the API

# Common Goose songs (for matching)
KNOWN_SONGS = {
    "Arcadia", "Hot Tea", "Arrow", "Rockdale", "Hungersite", "Factory Fiction",
    "Travelers", "Seekers on the Ridge", "All I Need", "Time to Flee", "Echo of a Rose",
    "Silver Rising", "Madhuvan", "Lead the Way", "Bob Don", "Creatures", "Yeti",
    "Tumble", "Butter Rum", "Empress of Organos", "Whipping Post",
    "Crosseyed and Painless", "Shakedown Street", "Honey Holes", "Ode to Oren",
}


class ElGooseScraper:
    def __init__(self):
        self.session = Session(engine)
        self.stats = {
            "shows_found": 0,
            "shows_created": 0,
            "shows_skipped": 0,
            "songs_created": 0,
            "performances_created": 0,
            "errors": 0,
        }

    def fetch_show_by_date(self, date_str):
        """
        Fetch setlist data for a specific date from El Goose API.
        Returns list of songs or None if no show found.
        """
        try:
            url = f"{EL_GOOSE_BASE_URL}/setlists/showdate/{date_str}.json"
            response = requests.get(url, timeout=10)

            if response.status_code == 200:
                data = response.json()
                # Check if it's wrapped in 'data' key
                if isinstance(data, dict) and 'data' in data:
                    if data.get('error') and data['error'] != 0:
                        return None
                    return data['data']
                elif isinstance(data, list) and len(data) > 0:
                    return data

            return None
        except Exception as e:
            logger.warning(f"Error fetching {date_str}: {e}")
            self.stats["errors"] += 1
            return None

    def get_or_create_song(self, song_name, set_data=None):
        """Get or create a Song record from setlist data."""
        try:
            # Check if song exists
            existing = self.session.exec(
                select(Song).where(Song.name == song_name)
            ).first()

            if existing:
                return existing

            # Determine if it's a cover based on song data
            is_cover = False
            original_artist = None

            if set_data and "artist" in set_data:
                # Some APIs include artist information
                is_cover = set_data["artist"] != "Goose"
                if is_cover:
                    original_artist = set_data["artist"]

            # Create slug
            slug = song_name.lower().replace(" ", "-").replace("'", "")

            song = Song(
                name=song_name,
                artist="Goose",
                slug=slug,
                is_cover=is_cover,
                original_artist=original_artist,
            )
            self.session.add(song)
            self.session.commit()
            self.session.refresh(song)
            self.stats["songs_created"] += 1
            return song
        except Exception as e:
            logger.error(f"Error creating song '{song_name}': {e}")
            self.session.rollback()
            self.stats["errors"] += 1
            return None

    def create_show(self, date_str, setlist_data):
        """Create a Show and its SongPerformance records."""
        try:
            if not setlist_data or len(setlist_data) == 0:
                return None

            first_item = setlist_data[0]

            # Extract show info
            elgoose_id = first_item.get("show_id") or first_item.get("showid")
            if not elgoose_id:
                logger.warning(f"No show_id found for {date_str}")
                return None

            # Check if show already exists
            existing = self.session.exec(
                select(Show).where(Show.elgoose_id == elgoose_id)
            ).first()

            if existing:
                self.stats["shows_skipped"] += 1
                return existing

            venue = first_item.get("venuename", "Unknown Venue")
            city = first_item.get("city", "Unknown City")
            state = first_item.get("state", "")
            location = f"{city}, {state}" if state else city

            # Create show
            show = Show(
                elgoose_id=elgoose_id,
                date=date_str,
                venue=venue,
                location=location,
                setlist_data=json.dumps(setlist_data),
            )
            self.session.add(show)
            self.session.flush()  # Get the show ID

            # Create performances
            position = 1
            current_set = 1

            for item in setlist_data:
                song_name = item.get("songname")
                if not song_name:
                    continue

                song = self.get_or_create_song(song_name, item)
                if not song:
                    continue

                # Detect set changes
                set_name = item.get("setname", f"Set {current_set}")
                if "Encore" in set_name:
                    current_set = 3
                elif set_name and "2" in set_name:
                    current_set = 2

                performance = SongPerformance(
                    song_id=song.id,
                    show_id=show.id,
                    position=position,
                    set_number=current_set,
                    notes=None,  # Could extract encore/guest info here
                )
                self.session.add(performance)
                position += 1
                self.stats["performances_created"] += 1

            self.session.commit()
            self.stats["shows_created"] += 1
            logger.info(f"✓ Created show: {venue} on {date_str} ({len(setlist_data)} songs)")
            return show

        except Exception as e:
            logger.error(f"Error creating show for {date_str}: {e}")
            self.session.rollback()
            self.stats["errors"] += 1
            return None

    def scrape_date_range(self, start_date, end_date, limit=None):
        """Scrape all shows within a date range."""
        current = start_date
        count = 0

        logger.info(f"Starting scrape from {start_date.date()} to {end_date.date()}")
        logger.info(f"This may take a while... fetching shows one day at a time")

        while current <= end_date:
            if limit and count >= limit:
                logger.info(f"Reached limit of {limit} shows")
                break

            date_str = current.strftime("%Y-%m-%d")

            setlist_data = self.fetch_show_by_date(date_str)
            if setlist_data:
                self.stats["shows_found"] += 1
                self.create_show(date_str, setlist_data)
                count += 1

            current += timedelta(days=1)

            # Progress indicator
            if count % 10 == 0:
                logger.info(f"Progress: {count} shows found, {self.stats['shows_created']} created")

    def print_stats(self):
        """Print final statistics."""
        logger.info("\n" + "="*60)
        logger.info("SCRAPING COMPLETE - Statistics")
        logger.info("="*60)
        logger.info(f"Shows found:         {self.stats['shows_found']}")
        logger.info(f"Shows created:       {self.stats['shows_created']}")
        logger.info(f"Shows skipped:       {self.stats['shows_skipped']}")
        logger.info(f"Songs created:       {self.stats['songs_created']}")
        logger.info(f"Performances:        {self.stats['performances_created']}")
        logger.info(f"Errors:              {self.stats['errors']}")
        logger.info("="*60 + "\n")


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Bulk populate Honkingversion database from El Goose API"
    )
    parser.add_argument(
        "--start",
        type=str,
        default=None,
        help="Start date (YYYY-MM-DD). Default: 365 days ago"
    )
    parser.add_argument(
        "--end",
        type=str,
        default=None,
        help="End date (YYYY-MM-DD). Default: today"
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Limit number of shows to fetch (for testing)"
    )

    args = parser.parse_args()

    # Create tables if they don't exist
    create_db_and_tables()

    # Parse dates
    end_date = datetime.strptime(args.end, "%Y-%m-%d") if args.end else datetime.now()
    start_date = (
        datetime.strptime(args.start, "%Y-%m-%d")
        if args.start
        else (end_date - timedelta(days=365))
    )

    logger.info("="*60)
    logger.info("El Goose Database Population Script")
    logger.info("="*60)
    logger.info(f"Date range: {start_date.date()} to {end_date.date()}")
    if args.limit:
        logger.info(f"Limit: {args.limit} shows")
    logger.info("="*60 + "\n")

    # Run scraper
    scraper = ElGooseScraper()
    scraper.scrape_date_range(start_date, end_date, limit=args.limit)
    scraper.print_stats()

    logger.info("✓ Database population complete!")
    logger.info("  Next step: Start the API server and browse the shows")


if __name__ == "__main__":
    main()
