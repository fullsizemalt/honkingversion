from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from pydantic import BaseModel

from database import get_session
from database import get_session
from models import User, Vote, Show, UserRead
from routes.auth import get_current_user
from datetime import datetime

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

from models import SongPerformance, PerformanceTag, ShowTag, Tag
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
