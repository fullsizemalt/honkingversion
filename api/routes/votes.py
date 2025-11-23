from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from pydantic import BaseModel

from database import get_session
from models import User, Vote, Show
from routes.auth import get_current_user

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
