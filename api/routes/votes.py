from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy import func, Integer
from datetime import datetime

from api.database import get_session
from api.models import User, Vote, Show, UserRead, UserFollow
from api.routes.auth import get_current_user
from api.services.notifications import create_notification
from api.models import SongPerformance, PerformanceTag, ShowTag, Tag, Song

router = APIRouter(prefix="/votes", tags=["votes"])

class VoteCreate(BaseModel):
    show_id: int
    rating: int
    comment: Optional[str] = None

class VoteRead(BaseModel):
    id: int
    user_id: int
    show_id: int
    rating: int
    comment: Optional[str] = None
    username: str

@router.post("/", response_model=VoteRead)
def create_vote(
    vote_in: VoteCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Check if show exists
    show = session.get(Show, vote_in.show_id)
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")

    # Check if user already voted
    statement = select(Vote).where(
        Vote.user_id == current_user.id,
        Vote.show_id == vote_in.show_id
    )
    existing_vote = session.exec(statement).first()

    if existing_vote:
        # Update existing vote
        existing_vote.rating = vote_in.rating
        existing_vote.comment = vote_in.comment
        session.add(existing_vote)
        session.commit()
        session.refresh(existing_vote)
        notify_new_vote(session, existing_vote.id, current_user.id)
        return VoteRead(
            id=existing_vote.id,
            user_id=existing_vote.user_id,
            show_id=existing_vote.show_id,
            rating=existing_vote.rating,
            comment=existing_vote.comment,
            username=current_user.username
        )
    else:
        # Create new vote
        vote = Vote(
            user_id=current_user.id,
            show_id=vote_in.show_id,
            rating=vote_in.rating,
            comment=vote_in.comment
        )
        session.add(vote)
        session.commit()
        session.refresh(vote)
        notify_new_vote(session, vote.id, current_user.id)
        return VoteRead(
            id=vote.id,
            user_id=vote.user_id,
            show_id=vote.show_id,
            rating=vote.rating,
            comment=vote.comment,
            username=current_user.username
        )

@router.get("/show/{show_id}", response_model=List[VoteRead])
def get_show_votes(
    show_id: int,
    session: Session = Depends(get_session)
):
    statement = select(Vote, User).join(User).where(Vote.show_id == show_id)
    results = session.exec(statement).all()
    
    votes_read = []
    for vote, user in results:
        votes_read.append(VoteRead(
            id=vote.id,
            user_id=vote.user_id,
            show_id=vote.show_id,
            rating=vote.rating,
            comment=vote.comment,
            username=user.username
        ))
    
    return votes_read

from sqlalchemy.orm import selectinload

class ShowSummary(BaseModel):
    id: int
    date: str
    venue: str
    location: str
    tags: List[Tag] = []

class PerformanceSummary(BaseModel):
    id: int
    song_name: str
    song_slug: str
    tags: List[Tag] = []

class UserReviewRead(BaseModel):
    id: int
    user: UserRead
    show: Optional[ShowSummary] = None
    performance: Optional[PerformanceSummary] = None
    rating: int
    blurb: Optional[str] = None
    full_review: Optional[str] = None
    created_at: datetime

@router.get("/", response_model=List[UserReviewRead])
def get_reviews(
    sort: Optional[str] = None,
    song_id: Optional[int] = None,
    song_name: Optional[str] = None,
    show_id: Optional[int] = None,
    show_date: Optional[str] = None,
    venue: Optional[str] = None,
    performance_id: Optional[int] = None,
    set_number: Optional[int] = None,
    tour: Optional[str] = None,
    day_of_week: Optional[int] = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
    min_rating: Optional[int] = None,
    max_rating: Optional[int] = None,
    review_type: Optional[str] = None,
    reviewer: Optional[str] = None,
    recency_days: Optional[int] = None,
    limit: int = 50,
    offset: int = 0,
    session: Session = Depends(get_session)
):
    """Get all reviews across the platform with optional filtering and sorting.

    Filters:
    - song_id: Filter by specific song ID
    - song_name: Filter by song name (partial match, case-insensitive)
    - show_id: Filter by specific show ID
    - show_date: Filter by show date (YYYY-MM-DD format)
    - venue: Filter by venue name (partial match, case-insensitive)
    - performance_id: Filter by specific performance ID
    - set_number: Filter by set number (1=Set 1, 2=Set 2, 3=Encore)
    - tour: Filter by tour name
    - day_of_week: Filter by day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
    - month: Filter by month (1-12)
    - year: Filter by year (YYYY)
    - min_rating: Minimum rating (1-5)
    - max_rating: Maximum rating (1-5)
    - review_type: 'detailed', 'quick', or None for all
    - reviewer: Filter by reviewer username
    - recency_days: Show reviews from last N days
    - sort: 'rating' for rating, otherwise by date (default)
    """
    statement = (
        select(Vote)
        .options(
            selectinload(Vote.user),
            selectinload(Vote.performance).selectinload(SongPerformance.song),
            selectinload(Vote.performance).selectinload(SongPerformance.performance_tags).selectinload(PerformanceTag.tag),
            selectinload(Vote.show).selectinload(Show.show_tags).selectinload(ShowTag.tag)
        )
    )

    # Only show reviews with blurb or full_review (actual reviews, not just votes)
    statement = statement.where(
        (Vote.blurb != None) | (Vote.full_review != None)
    )

    # Apply filters
    if show_id:
        statement = statement.where(Vote.show_id == show_id)

    if show_date:
        statement = statement.where(Vote.show_id.in_(
            select(Show.id).where(Show.date == show_date)
        ))

    if performance_id:
        statement = statement.where(Vote.performance_id == performance_id)

    if song_id:
        # Join to SongPerformance to filter by song
        statement = statement.join(SongPerformance).where(SongPerformance.song_id == song_id)

    if song_name:
        # Join to SongPerformance and Song to filter by song name
        statement = statement.join(SongPerformance).join(Song).where(
            Song.name.ilike(f"%{song_name}%")
        )

    if venue:
        # Join to Show to filter by venue
        if not (show_id or show_date or song_name or song_id or tour):
            statement = statement.join(Show)
        statement = statement.where(Show.venue.ilike(f"%{venue}%"))

    if set_number:
        # Join to SongPerformance to filter by set number
        if not (song_id or song_name):
            statement = statement.join(SongPerformance)
        statement = statement.where(SongPerformance.set_number == set_number)

    if tour:
        # Join to Show to filter by tour
        if not (show_id or show_date or song_name or song_id or venue):
            # Only join if not already joined
            statement = statement.join(Show)
        statement = statement.where(Show.tour.ilike(f"%{tour}%"))

    if day_of_week is not None:
        # Filter by day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
        # Using strftime for SQLite compatibility
        if not (show_id or show_date or venue or song_name or song_id or tour):
            statement = statement.join(Show)
        statement = statement.where(func.cast(func.strftime('%w', Show.date), Integer) == day_of_week)

    if month is not None:
        # Filter by month (1-12)
        if not (show_id or show_date or venue or song_name or song_id or tour or day_of_week is not None):
            statement = statement.join(Show)
        statement = statement.where(func.cast(func.strftime('%m', Show.date), Integer) == month)

    if year is not None:
        # Filter by year (YYYY)
        if not (show_id or show_date or venue or song_name or song_id or tour or day_of_week is not None or month is not None):
            statement = statement.join(Show)
        statement = statement.where(func.cast(func.strftime('%Y', Show.date), Integer) == year)

    if min_rating is not None:
        # Filter by minimum rating
        statement = statement.where(Vote.rating >= min_rating)

    if max_rating is not None:
        # Filter by maximum rating
        statement = statement.where(Vote.rating <= max_rating)

    if review_type:
        # Filter by review type (detailed vs quick/blurb)
        if review_type == 'detailed':
            # Only full_review present (detailed reviews)
            statement = statement.where(Vote.full_review != None)
        elif review_type == 'quick':
            # Only blurb present (quick takes)
            statement = statement.where((Vote.blurb != None) & (Vote.full_review == None))

    if reviewer:
        # Filter by reviewer username
        if not (song_id or song_name):
            statement = statement.join(User)
        statement = statement.where(User.username.ilike(f"%{reviewer}%"))

    if recency_days is not None:
        # Filter by recency - reviews created in last N days
        cutoff_date = func.datetime('now', f'-{recency_days} days')
        statement = statement.where(Vote.created_at >= cutoff_date)

    # Sort by rating if requested, otherwise by date
    if sort == 'rating':
        statement = statement.order_by(Vote.rating.desc())
    else:
        statement = statement.order_by(Vote.created_at.desc())

    statement = statement.limit(limit).offset(offset)
    votes = session.exec(statement).all()

    results = []
    for vote in votes:
        show_summary = None
        if vote.show:
            show_summary = ShowSummary(
                id=vote.show.id,
                date=vote.show.date,
                venue=vote.show.venue,
                location=vote.show.location,
                tags=[st.tag for st in vote.show.show_tags] if vote.show.show_tags else []
            )

        performance_summary = None
        if vote.performance:
            performance_summary = PerformanceSummary(
                id=vote.performance.id,
                song_name=vote.performance.song.name,
                song_slug=vote.performance.song.slug,
                tags=[pt.tag for pt in vote.performance.performance_tags] if vote.performance.performance_tags else []
            )

        user_read = UserRead(
            id=vote.user.id,
            username=vote.user.username,
            email=vote.user.email,
            created_at=vote.user.created_at
        )

        results.append(UserReviewRead(
            id=vote.id,
            user=user_read,
            show=show_summary,
            performance=performance_summary,
            rating=vote.rating,
            blurb=vote.blurb,
            full_review=vote.full_review,
            created_at=vote.created_at
        ))

    return results

@router.get("/user/{username}", response_model=List[UserReviewRead])
def get_user_votes(username: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    statement = (
        select(Vote)
        .where(Vote.user_id == user.id)
        .options(
            selectinload(Vote.performance).selectinload(SongPerformance.song),
            selectinload(Vote.performance).selectinload(SongPerformance.performance_tags).selectinload(PerformanceTag.tag),
            selectinload(Vote.show).selectinload(Show.show_tags).selectinload(ShowTag.tag)
        )
        .order_by(Vote.created_at.desc())
    )
    votes = session.exec(statement).all()
    
    results = []
    for vote in votes:
        show_summary = None
        if vote.show:
            show_summary = ShowSummary(
                id=vote.show.id,
                date=vote.show.date,
                venue=vote.show.venue,
                location=vote.show.location,
                tags=[st.tag for st in vote.show.show_tags] if vote.show.show_tags else []
            )
            
        performance_summary = None
        if vote.performance:
            performance_summary = PerformanceSummary(
                id=vote.performance.id,
                song_name=vote.performance.song.name,
                song_slug=vote.performance.song.slug,
                tags=[pt.tag for pt in vote.performance.performance_tags] if vote.performance.performance_tags else []
            )
            
        # Create UserRead manually or from_orm if configured
        user_read = UserRead(
            id=user.id,
            username=user.username,
            email=user.email,
            created_at=user.created_at
            # stats can be None or computed if we want
        )

        results.append(UserReviewRead(
            id=vote.id,
            user=user_read,
            show=show_summary,
            performance=performance_summary,
            rating=vote.rating,
            blurb=vote.comment, # Mapping comment to blurb
            full_review=None, # Assuming full_review is not in Vote model yet or mapped differently
            created_at=vote.created_at
        ))
    return results

def notify_new_vote(session: Session, vote_id: int, actor_id: int):
    follower_ids = session.exec(
        select(UserFollow.follower_id)
        .where(UserFollow.followed_id == actor_id)
    ).all()
    if not follower_ids:
        return
    follower_ids = [fid for fid, in follower_ids] if isinstance(follower_ids[0], tuple) else follower_ids
    for uid in follower_ids:
        create_notification(
            session,
            user_id=uid,
            actor_id=actor_id,
            type="review",
            object_type="vote",
            object_id=vote_id,
        )
