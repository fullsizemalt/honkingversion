"""
On-demand show fetcher: Fetch shows from El Goose API and populate database on-the-fly.

This module provides functionality to:
1. Check if a show exists in the database
2. If not, fetch it from El Goose API
3. Parse and store it in the database
4. Return the show data to the user

This allows the database to grow organically as users request shows,
without requiring a bulk initial scrape.
"""

import requests
import json
import logging
from datetime import datetime
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError

from api.models import Show, Song, SongPerformance
from api.services.cache_manager import CacheManager

logger = logging.getLogger(__name__)

EL_GOOSE_BASE_URL = "https://elgoose.net/api/v2"


class ShowFetcher:
    """Fetch and populate shows on-demand from El Goose API."""

    @staticmethod
    def fetch_from_elgoose(date_str: str):
        """
        Fetch setlist data from El Goose for a specific date.

        Args:
            date_str: Date in YYYY-MM-DD format

        Returns:
            List of show data or None if not found
        """
        from services.cache_manager import CacheManager
        cache = CacheManager()
        cache_key = f"show_date_{date_str}"
        
        # Check cache first
        cached_data = cache.get(cache_key)
        if cached_data:
            logger.info(f"Using cached data for {date_str}")
            return cached_data

        try:
            url = f"{EL_GOOSE_BASE_URL}/setlists/showdate/{date_str}.json"
            response = requests.get(url, timeout=10)

            if response.status_code == 200:
                data = response.json()

                # Handle wrapped response
                result = None
                if isinstance(data, dict) and "data" in data:
                    if data.get("error") and data["error"] != 0:
                        return None
                    result = data["data"]
                elif isinstance(data, list) and len(data) > 0:
                    result = data
                
                if result:
                    cache.set(cache_key, result)
                    return result

            return None
        except Exception as e:
            logger.warning(f"Error fetching from El Goose for {date_str}: {e}")
            return None

    @staticmethod
    def create_or_update_song(session: Session, song_name: str, item_data: dict = None) -> Song:
        """
        Get existing song or create new one.

        Args:
            session: Database session
            song_name: Name of the song
            item_data: Optional El Goose item data with additional info

        Returns:
            Song object
        """
        # Try to find existing song
        existing = session.exec(
            select(Song).where(Song.name == song_name)
        ).first()

        if existing:
            return existing

        # Determine if it's a cover
        is_cover = False
        original_artist = None

        if item_data and "artist" in item_data:
            is_cover = item_data.get("artist", "").lower() != "goose"
            if is_cover:
                original_artist = item_data.get("artist")

        # Create slug
        slug = song_name.lower().replace(" ", "-").replace("'", "").replace(".", "")

        # Create new song
        song = Song(
            name=song_name,
            artist="Goose",
            slug=slug,
            is_cover=is_cover,
            original_artist=original_artist,
        )

        try:
            session.add(song)
            session.commit()
            session.refresh(song)
            return song
        except IntegrityError:
            # Handle race condition where song was created by another request
            session.rollback()
            return session.exec(
                select(Song).where(Song.name == song_name)
            ).first()

    @staticmethod
    def populate_show(session: Session, date_str: str, setlist_data: list) -> Show:
        """
        Create a show and its song performances from El Goose data.

        Args:
            session: Database session
            date_str: Date in YYYY-MM-DD format
            setlist_data: List of song data from El Goose API

        Returns:
            Show object or None if creation failed
        """
        try:
            if not setlist_data or len(setlist_data) == 0:
                return None

            first_item = setlist_data[0]

            # Extract identifiers
            elgoose_id = first_item.get("show_id") or first_item.get("showid")
            if not elgoose_id:
                logger.warning(f"No show_id in El Goose data for {date_str}")
                return None

            # Check if already exists
            existing = session.exec(
                select(Show).where(Show.elgoose_id == elgoose_id)
            ).first()

            if existing:
                return existing

            # Extract venue info
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

            session.add(show)
            session.flush()  # Get show ID for foreign key

            # Create performances
            position = 1
            current_set = 1

            for item in setlist_data:
                song_name = item.get("songname")
                if not song_name:
                    continue

                # Get or create song
                song = ShowFetcher.create_or_update_song(session, song_name, item)

                # Determine set number from setname
                set_name = item.get("setname", "")
                if "Encore" in set_name:
                    current_set = 3
                elif "2" in set_name:
                    current_set = 2

                # Create performance
                performance = SongPerformance(
                    song_id=song.id,
                    show_id=show.id,
                    position=position,
                    set_number=current_set,
                    notes=None,  # Could extract guest info here
                )

                session.add(performance)
                position += 1

            # Commit all changes
            session.commit()
            session.refresh(show)

            logger.info(
                f"✓ Created show: {venue} on {date_str} "
                f"({len(setlist_data)} songs, elgoose_id={elgoose_id})"
            )

            return show

        except IntegrityError:
            # Handle race condition where show was created by concurrent request
            session.rollback()
            return session.exec(
                select(Show).where(Show.date == date_str)
            ).first()
        except Exception as e:
            logger.error(f"Error populating show for {date_str}: {e}")
            session.rollback()
            return None

    @staticmethod
    def get_or_fetch_show(session: Session, date_str: str) -> Show:
        """
        Get show from database, or fetch from El Goose and populate if not found.

        This is the main entry point for on-demand show fetching.

        Args:
            session: Database session
            date_str: Date in YYYY-MM-DD format

        Returns:
            Show object or None if not found in either source
        """
        # Check database first
        show = session.exec(
            select(Show).where(Show.date == date_str)
        ).first()

        if show:
            logger.debug(f"Found show in database for {date_str}")
            return show

        # Not in database, fetch from El Goose
        logger.info(f"Show not in database, fetching from El Goose for {date_str}")
        setlist_data = ShowFetcher.fetch_from_elgoose(date_str)

        if not setlist_data:
            logger.info(f"No show found in El Goose for {date_str}")
            return None

        # Populate database
        show = ShowFetcher.populate_show(session, date_str, setlist_data)
        return show
