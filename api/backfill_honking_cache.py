#!/usr/bin/env python3
"""
Backfill honking version cache for existing data.

This script populates the denormalized cache fields with values
calculated from the existing HonkingVersion records.

Run this AFTER applying the migration that adds the cache columns.

Usage:
    python backfill_honking_cache.py                    # Full backfill
    python backfill_honking_cache.py --verify-only      # Verify without changes
    python backfill_honking_cache.py --fix              # Fix inconsistencies
"""

import sys
import logging
from sqlmodel import Session
from database import engine, create_db_and_tables
from models import Song, SongPerformance, HonkingVersion
from services.honking_cache import HonkingCacheService
import argparse

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def backfill_cache(verify_only: bool = False):
    """
    Backfill the honking version cache from existing vote data.

    Args:
        verify_only: If True, only verify cache consistency without changes
    """
    create_db_and_tables()

    with Session(engine) as session:
        logger.info("=" * 70)
        logger.info("HONKING VERSION CACHE BACKFILL")
        logger.info("=" * 70)

        if verify_only:
            logger.info("Running in VERIFY-ONLY mode (no database changes)")
        else:
            logger.info("Running in BACKFILL mode (will update database)")

        # Get all songs with honking votes
        from sqlmodel import select, func
        songs_with_votes = session.exec(
            select(HonkingVersion.song_id).distinct()
        ).all()

        logger.info(f"Found {len(songs_with_votes)} songs with honking votes")

        songs_updated = 0
        songs_fixed = 0
        performances_updated = 0
        inconsistencies_found = 0

        for song_id in songs_with_votes:
            # Verify cache consistency before update
            is_consistent = HonkingCacheService.verify_cache_consistency(
                session, song_id
            )

            if not is_consistent:
                inconsistencies_found += 1
                logger.warning(f"Cache inconsistency detected for song {song_id}")

            if not verify_only:
                # Rebuild cache for this song
                HonkingCacheService.recalculate_song_cache(session, song_id)

                # Rebuild cache for all performances in this song
                performances = session.exec(
                    select(SongPerformance.id).where(
                        SongPerformance.song_id == song_id
                    )
                ).all()

                for perf_id in performances:
                    HonkingCacheService.recalculate_performance_cache(session, perf_id)
                    performances_updated += 1

                songs_updated += 1

                # Progress indicator
                if songs_updated % 10 == 0:
                    logger.info(f"Progress: {songs_updated} songs processed")

        if not verify_only:
            session.commit()

        # Final verification pass
        logger.info("Running final verification pass...")
        final_inconsistencies = 0
        for song_id in songs_with_votes:
            is_consistent = HonkingCacheService.verify_cache_consistency(
                session, song_id
            )
            if not is_consistent:
                final_inconsistencies += 1

        logger.info("\n" + "=" * 70)
        logger.info("BACKFILL COMPLETE - Summary")
        logger.info("=" * 70)
        logger.info(f"Songs processed:           {songs_updated if not verify_only else len(songs_with_votes)}")
        logger.info(f"Performances updated:      {performances_updated}")
        logger.info(f"Initial inconsistencies:   {inconsistencies_found}")
        logger.info(f"Final inconsistencies:     {final_inconsistencies}")
        logger.info(f"Mode:                      {'VERIFY-ONLY' if verify_only else 'BACKFILL'}")

        if final_inconsistencies > 0:
            logger.warning(f"⚠️  {final_inconsistencies} inconsistencies remain!")
            return False
        else:
            logger.info("✓ Cache is fully consistent")
            return True


def main():
    parser = argparse.ArgumentParser(
        description="Backfill honking version cache"
    )
    parser.add_argument(
        "--verify-only",
        action="store_true",
        help="Only verify consistency without making changes"
    )
    parser.add_argument(
        "--fix",
        action="store_true",
        help="Fix inconsistencies (alias for normal backfill)"
    )

    args = parser.parse_args()

    success = backfill_cache(verify_only=args.verify_only)

    if success:
        logger.info("\n✓ Cache backfill successful!")
        sys.exit(0)
    else:
        logger.error("\n✗ Cache backfill completed with warnings")
        sys.exit(1)


if __name__ == "__main__":
    main()
