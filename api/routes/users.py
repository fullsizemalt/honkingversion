from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from database import get_session
from database import get_session
from models import User, UserList, UserRead, UserStats, Vote, UserFollow

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserRead)
def read_users_me(session: Session = Depends(get_session)):
    # Placeholder for actual user retrieval from token
    # In real app: current_user = get_current_user(token)
    # For now, just return the first user or empty
    statement = select(User)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="No users found")
    
    # Compute stats
    reviews_count = session.exec(select(Vote).where(Vote.user_id == user.id)).all()
    # Simple count for now
    stats = UserStats(
        shows_attended=0, # TODO: Implement logic
        reviews_count=len(reviews_count),
        followers_count=0, # TODO: Implement logic
        following_count=0 # TODO: Implement logic
    )
    
    return UserRead(
        id=user.id,
        username=user.username,
        email=user.email,
        created_at=user.created_at,
        stats=stats
    )

@router.get("/{username}", response_model=UserRead)
def read_user(username: str, session: Session = Depends(get_session)):
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Compute stats
    reviews_count = session.exec(select(Vote).where(Vote.user_id == user.id)).all()
    
    stats = UserStats(
        shows_attended=0,
        reviews_count=len(reviews_count),
        followers_count=0,
        following_count=0
    )
    
    return UserRead(
        id=user.id,
        username=user.username,
        email=user.email, # Note: Might want to hide email for public profiles later
        created_at=user.created_at,
        stats=stats
    )

@router.post("/lists", response_model=UserList)
def create_list(user_list: UserList, session: Session = Depends(get_session)):
    session.add(user_list)
    session.commit()
    session.refresh(user_list)
    return user_list
