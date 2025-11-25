"""
Honking Version Cache Maintenance Service

This service maintains denormalized cache fields for efficient honking version lookups.
All cache updates are transactional to ensure consistency.

Cache Fields:
- SongPerformance.honking_vote_count: cached vote count for the performance
- SongPerformance.honking_votes_updated_at: timestamp of last update
- Song.current_honking_performance_id: ID of winning performance (FK)
- Song.current_honking_vote_count: vote count of the winner
- Song.honking_version_updated_at: timestamp of last update

The cache is maintained transactionally whenever votes are created/updated/deleted.
"""

from sqlmodel import Session, select, func
from datetime import datetime
from typing import Optional, Tuple
from api.models import HonkingVersion, Song, SongPerformance
import logging

logger = logging.getLogger(__name__)


class HonkingCacheService:
    """Service for maintaining honking version cache consistency."""

    @staticmethod
    def recalculate_performance_cache(
        session: Session,
        performance_id: int
    ) -> int:
        """
        Recalculate honking vote count for a performance.

        Args:
            session: Database session
            performance_id: ID of the performance to update

        Returns:
            The new vote count for the performance
        """
        # Get the performance
        performance = session.get(SongPerformance, performance_id)
        if not performance:
            return 0

        # Count all honking votes for this performance
        vote_count = session.exec(
            select(func.count(HonkingVersion.id)).where(
                HonkingVersion.performance_id == performance_id
            )
        ).first() or 0

        # Update the cache
        performance.honking_vote_count = vote_count
        performance.honking_votes_updated_at = datetime.utcnow()
        session.add(performance)

        logger.debug(f"Updated performance {performance_id} honking cache: {vote_count} votes")
        return vote_count

    @staticmethod
    def recalculate_song_cache(
        session: Session,
        song_id: int
    ) -> Tuple[Optional[int], int]:
        """
        Recalculate honking version cache for a song.
        Finds the performance with the most honking votes.

        Args:
            session: Database session
            song_id: ID of the song to update

        Returns:
            Tuple of (winning_performance_id, vote_count) or (None, 0) if no votes
        """
        # Verify song exists
        song = session.get(Song, song_id)
        if not song:
            return None, 0

        # Find the performance with the most honking votes
        statement = select(
            HonkingVersion.performance_id,
            func.count(HonkingVersion.id).label("vote_count")
        ).where(
            HonkingVersion.song_id == song_id
        ).group_by(
            HonkingVersion.performance_id
        ).order_by(
            func.count(HonkingVersion.id).desc()
        ).limit(1)

        result = session.exec(statement).first()

        if result:
            perf_id, vote_count = result
            song.current_honking_performance_id = perf_id
            song.current_honking_vote_count = vote_count
        else:
            song.current_honking_performance_id = None
            song.current_honking_vote_count = 0

        song.honking_version_updated_at = datetime.utcnow()
        session.add(song)

        logger.debug(
            f"Updated song {song_id} honking cache: "
            f"winner={result[0] if result else None}, votes={song.current_honking_vote_count}"
        )

        return (result[0] if result else None), song.current_honking_vote_count

    @staticmethod
    def on_honking_vote_created(
        session: Session,
        honking_vote: HonkingVersion
    ) -> None:
        """
        Called when a new honking version vote is created.
        Updates the cache for the affected performance and song.

        Args:
            session: Database session
            honking_vote: The newly created HonkingVersion
        """
        # Update performance cache
        HonkingCacheService.recalculate_performance_cache(
            session, honking_vote.performance_id
        )

        # Update song cache
        HonkingCacheService.recalculate_song_cache(session, honking_vote.song_id)

        logger.info(
            f"Cache updated after honking vote created: "
            f"user={honking_vote.user_id}, song={honking_vote.song_id}, perf={honking_vote.performance_id}"
        )

    @staticmethod
    def on_honking_vote_changed(
        session: Session,
        old_performance_id: int,
        new_honking_vote: HonkingVersion
    ) -> None:
        """
        Called when a honking version vote is updated (changed to different performance).
        Updates cache for both old and new performances, and the song.

        Args:
            session: Database session
            old_performance_id: The performance ID that was previously voted for
            new_honking_vote: The updated HonkingVersion
        """
        # Update old performance cache
        HonkingCacheService.recalculate_performance_cache(session, old_performance_id)

        # Update new performance cache
        HonkingCacheService.recalculate_performance_cache(
            session, new_honking_vote.performance_id
        )

        # Update song cache
        HonkingCacheService.recalculate_song_cache(session, new_honking_vote.song_id)

        logger.info(
            f"Cache updated after honking vote changed: "
            f"user={new_honking_vote.user_id}, song={new_honking_vote.song_id}, "
            f"old_perf={old_performance_id}, new_perf={new_honking_vote.performance_id}"
        )

    @staticmethod
    def on_honking_vote_deleted(
        session: Session,
        song_id: int,
        performance_id: int
    ) -> None:
        """
        Called when a honking version vote is deleted.
        Updates cache for the affected performance and song.

        Args:
            session: Database session
            song_id: ID of the song
            performance_id: ID of the performance that was voted for
        """
        # Update performance cache
        HonkingCacheService.recalculate_performance_cache(session, performance_id)

        # Update song cache
        HonkingCacheService.recalculate_song_cache(session, song_id)

        logger.info(
            f"Cache updated after honking vote deleted: "
            f"song={song_id}, perf={performance_id}"
        )

    @staticmethod
    def verify_cache_consistency(
        session: Session,
        song_id: int
    ) -> bool:
        """
        Verify that the cache is consistent with actual vote counts.
        Used for integrity checks and debugging.

        Args:
            session: Database session
            song_id: ID of the song to verify

        Returns:
            True if cache is consistent, False otherwise
        """
        song = session.get(Song, song_id)
        if not song:
            return False

        # Get actual vote counts
        statement = select(
            HonkingVersion.performance_id,
            func.count(HonkingVersion.id).label("vote_count")
        ).where(
            HonkingVersion.song_id == song_id
        ).group_by(
            HonkingVersion.performance_id
        ).order_by(
            func.count(HonkingVersion.id).desc()
        )

        results = session.exec(statement).all()

        # Verify performance caches
        for perf_id, expected_count in results:
            perf = session.get(SongPerformance, perf_id)
            if perf and perf.honking_vote_count != expected_count:
                logger.warning(
                    f"Cache inconsistency: Performance {perf_id} has cached count "
                    f"{perf.honking_vote_count} but actual count is {expected_count}"
                )
                return False

        # Verify song cache
        if results:
            expected_winner_id, expected_winner_count = results[0]
            if song.current_honking_performance_id != expected_winner_id:
                logger.warning(
                    f"Cache inconsistency: Song {song_id} has cached winner "
                    f"{song.current_honking_performance_id} but actual winner is {expected_winner_id}"
                )
                return False
            if song.current_honking_vote_count != expected_winner_count:
                logger.warning(
                    f"Cache inconsistency: Song {song_id} has cached vote count "
                    f"{song.current_honking_vote_count} but actual count is {expected_winner_count}"
                )
                return False
        else:
            # No votes, cache should be empty
            if song.current_honking_performance_id is not None or song.current_honking_vote_count != 0:
                logger.warning(
                    f"Cache inconsistency: Song {song_id} has cached data "
                    f"but no actual votes exist"
                )
                return False

        return True

    @staticmethod
    def rebuild_all_cache(session: Session) -> Tuple[int, int]:
        """
        Rebuild the entire honking version cache from scratch.
        Used for migrations or recovery from cache corruption.

        Args:
            session: Database session

        Returns:
            Tuple of (songs_updated, performances_updated)
        """
        songs_updated = 0
        performances_updated = 0

        # Get all songs with honking votes
        songs_with_votes = session.exec(
            select(HonkingVersion.song_id).distinct()
        ).all()

        for song_id in songs_with_votes:
            HonkingCacheService.recalculate_song_cache(session, song_id)
            songs_updated += 1

            # Also update all performances for this song
            performances = session.exec(
                select(SongPerformance.id).where(SongPerformance.song_id == song_id)
            ).all()

            for perf_id in performances:
                HonkingCacheService.recalculate_performance_cache(session, perf_id)
                performances_updated += 1

        session.commit()
        logger.info(
            f"Cache rebuild complete: {songs_updated} songs, {performances_updated} performances"
        )
        return songs_updated, performances_updated
