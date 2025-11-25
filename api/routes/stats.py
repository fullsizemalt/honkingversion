from datetime import datetime, timedelta
from typing import List, Dict, Any

from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func

from api.database import get_session
from api.models import Show, Song, SongPerformance, Vote, User, UserFollow, Notification

router = APIRouter(prefix="/stats", tags=["stats"])


def build_stats_payload(session: Session) -> Dict[str, Any]:
    # Top songs by play count
    song_counts = session.exec(
        select(Song.name, Song.slug, func.count(SongPerformance.id).label("plays"))
        .join(SongPerformance, Song.id == SongPerformance.song_id)
        .group_by(Song.id)
        .order_by(func.count(SongPerformance.id).desc())
        .limit(10)
    ).all()

    # Top venues by show count
    top_venues = session.exec(
        select(Show.venue, func.count(Show.id).label("show_count"))
        .group_by(Show.venue)
        .order_by(func.count(Show.id).desc())
        .limit(10)
    ).all()

    # Trending performances by votes in last 30 days
    since = datetime.utcnow() - timedelta(days=30)
    trending_performances = session.exec(
        select(
            SongPerformance.id,
            Song.name,
            Show.date,
            Show.venue,
            func.count(Vote.id).label("votes_last_30d"),
            func.avg(Vote.rating).label("avg_rating"),
        )
        .join(Show, SongPerformance.show_id == Show.id)
        .join(Song, SongPerformance.song_id == Song.id)
        .join(Vote, Vote.performance_id == SongPerformance.id)
        .where(Vote.created_at >= since)
        .group_by(SongPerformance.id)
        .order_by(func.count(Vote.id).desc())
        .limit(10)
    ).all()

    # User leaderboard by votes cast
    user_votes = session.exec(
        select(User.username, func.count(Vote.id).label("votes_cast"))
        .join(Vote, Vote.user_id == User.id)
        .group_by(User.id)
        .order_by(func.count(Vote.id).desc())
        .limit(10)
    ).all()

    # Followers leaderboard
    follower_counts = session.exec(
        select(User.username, func.count(UserFollow.id).label("followers"))
        .join(UserFollow, UserFollow.followed_id == User.id)
        .group_by(User.id)
        .order_by(func.count(UserFollow.id).desc())
        .limit(10)
    ).all()

    # Recent comments/blurbs (votes with non-null blurbs) from last 7 days
    recent_comments = session.exec(
        select(
            Vote.blurb,
            User.username,
            Song.name,
            Show.date,
            Show.venue,
            Vote.created_at
        )
        .join(User, Vote.user_id == User.id)
        .join(SongPerformance, Vote.performance_id == SongPerformance.id)
        .join(Song, SongPerformance.song_id == Song.id)
        .join(Show, SongPerformance.show_id == Show.id)
        .where(Vote.blurb.isnot(None))
        .where(Vote.created_at >= datetime.utcnow() - timedelta(days=7))
        .order_by(Vote.created_at.desc())
        .limit(10)
    ).all()

    # New submissions - performances that just got their first vote
    one_week_ago = datetime.utcnow() - timedelta(days=7)
    new_submissions = session.exec(
        select(
            SongPerformance.id,
            Song.name,
            Show.date,
            Show.venue,
            func.count(Vote.id).label("vote_count"),
            func.avg(Vote.rating).label("avg_rating")
        )
        .join(Song, SongPerformance.song_id == Song.id)
        .join(Show, SongPerformance.show_id == Show.id)
        .join(Vote, Vote.performance_id == SongPerformance.id)
        .where(Vote.created_at >= one_week_ago)
        .group_by(SongPerformance.id)
        .order_by(func.min(Vote.created_at).desc())
        .limit(10)
    ).all()

    return {
        "top_songs": [{"name": row[0], "slug": row[1], "plays": row[2]} for row in song_counts],
        "top_venues": [{"venue": row[0], "show_count": row[1]} for row in top_venues],
        "trending_performances": [
            {
                "performance_id": row[0],
                "song_name": row[1],
                "date": row[2],
                "venue": row[3],
                "votes_last_30d": row[4],
                "avg_rating": round(row[5], 1) if row[5] is not None else None,
            }
            for row in trending_performances
        ],
        "leaderboards": {
            "votes_cast": [{"username": row[0], "votes": row[1]} for row in user_votes],
            "followers": [{"username": row[0], "followers": row[1]} for row in follower_counts],
        },
        "recent_comments": [
            {
                "blurb": row[0],
                "username": row[1],
                "song_name": row[2],
                "show_date": row[3],
                "venue": row[4],
                "created_at": row[5].isoformat() if row[5] else None
            }
            for row in recent_comments
        ],
        "new_submissions": [
            {
                "performance_id": row[0],
                "song_name": row[1],
                "date": row[2],
                "venue": row[3],
                "vote_count": row[4],
                "avg_rating": round(row[5], 1) if row[5] is not None else None,
            }
            for row in new_submissions
        ],
    }


@router.get("", include_in_schema=False)
@router.get("/")
def get_stats(session: Session = Depends(get_session)) -> Dict[str, Any]:
    """Return overall site stats (supports both /stats and /stats/)."""
    return build_stats_payload(session)
