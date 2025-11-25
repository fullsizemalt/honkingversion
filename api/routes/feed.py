from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from sqlalchemy.orm import selectinload

from database import get_session
from models import Vote, SongPerformance, PerformanceTag, ShowTag, Tag, Show, User
from routes.auth import get_current_user_optional

router = APIRouter(prefix="/feed", tags=["feed"])


class FeedUser(BaseModel):
    id: int
    username: str


class FeedPerformance(BaseModel):
    id: int
    song_name: Optional[str] = None
    song_slug: Optional[str] = None
    show_id: Optional[int] = None
    show_date: Optional[str] = None
    venue: Optional[str] = None
    location: Optional[str] = None


class FeedShow(BaseModel):
    id: int
    date: str
    venue: str
    location: str


class FeedItem(BaseModel):
    id: int
    user: FeedUser
    rating: Optional[int] = None
    blurb: Optional[str] = None
    full_review: Optional[str] = None
    created_at: datetime
    performance: Optional[FeedPerformance] = None
    show: Optional[FeedShow] = None


def serialize_vote(vote: Vote) -> FeedItem:
    performance = None
    if vote.performance:
        performance = FeedPerformance(
            id=vote.performance.id,
            song_name=getattr(vote.performance.song, "name", None),
            song_slug=getattr(vote.performance.song, "slug", None),
            show_id=vote.performance.show_id,
            show_date=getattr(vote.performance.show, "date", None) if vote.performance.show else None,
            venue=getattr(vote.performance.show, "venue", None) if vote.performance.show else None,
            location=getattr(vote.performance.show, "location", None) if vote.performance.show else None,
        )

    show_summary = None
    if vote.show:
        show_summary = FeedShow(
            id=vote.show.id,
            date=vote.show.date,
            venue=vote.show.venue,
            location=vote.show.location,
        )

    return FeedItem(
        id=vote.id,
        user=FeedUser(id=vote.user.id, username=vote.user.username) if vote.user else FeedUser(id=-1, username="unknown"),
        rating=vote.rating,
        blurb=vote.blurb,
        full_review=vote.full_review,
        created_at=vote.created_at,
        performance=performance,
        show=show_summary,
    )


@router.get("/community", response_model=List[FeedItem])
def community_feed(
    limit: int = 20,
    offset: int = 0,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Recent activity across all users."""
    votes = session.exec(
        select(Vote)
        .options(
            selectinload(Vote.user),
            selectinload(Vote.performance).selectinload(SongPerformance.song),
            selectinload(Vote.performance).selectinload(SongPerformance.show),
            selectinload(Vote.performance).selectinload(SongPerformance.performance_tags).selectinload(PerformanceTag.tag),
            selectinload(Vote.show).selectinload(Show.show_tags).selectinload(ShowTag.tag),
        )
        .order_by(Vote.created_at.desc())
        .limit(limit)
        .offset(offset)
    ).all()

    return [serialize_vote(v) for v in votes]
