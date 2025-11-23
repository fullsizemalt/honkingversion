from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from typing import List
from pydantic import BaseModel
from datetime import datetime

from database import get_session
from models import User, UserFollow
from routes.auth import get_current_user

router = APIRouter(prefix="/follows", tags=["follows"])

class UserSummary(BaseModel):
    id: int
    username: str
    created_at: datetime

@router.post("/{username}")
def follow_user(
    username: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Get the user to follow
    target_user = session.exec(select(User).where(User.username == username)).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Can't follow yourself
    if target_user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")
    
    # Check if already following
    existing = session.exec(
        select(UserFollow).where(
            UserFollow.follower_id == current_user.id,
            UserFollow.followed_id == target_user.id
        )
    ).first()
    
    if existing:
        return {"message": "Already following"}
    
    # Create follow relationship
    follow = UserFollow(
        follower_id=current_user.id,
        followed_id=target_user.id,
        created_at=datetime.utcnow()
    )
    session.add(follow)
    session.commit()
    return {"message": "Followed successfully"}

@router.delete("/{username}")
def unfollow_user(
    username: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Get the user to unfollow
    target_user = session.exec(select(User).where(User.username == username)).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Find the follow relationship
    follow = session.exec(
        select(UserFollow).where(
            UserFollow.follower_id == current_user.id,
            UserFollow.followed_id == target_user.id
        )
    ).first()
    
    if not follow:
        raise HTTPException(status_code=404, detail="Not following this user")
    
    session.delete(follow)
    session.commit()
    return {"message": "Unfollowed successfully"}

@router.get("/{username}/followers", response_model=List[UserSummary])
def get_followers(
    username: str,
    session: Session = Depends(get_session)
):
    # Get the user
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get all followers
    followers = session.exec(
        select(User)
        .join(UserFollow, UserFollow.follower_id == User.id)
        .where(UserFollow.followed_id == user.id)
        .order_by(UserFollow.created_at.desc())
    ).all()
    
    return [UserSummary(id=u.id, username=u.username, created_at=u.created_at) for u in followers]

@router.get("/{username}/following", response_model=List[UserSummary])
def get_following(
    username: str,
    session: Session = Depends(get_session)
):
    # Get the user
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get all users they're following
    following = session.exec(
        select(User)
        .join(UserFollow, UserFollow.followed_id == User.id)
        .where(UserFollow.follower_id == user.id)
        .order_by(UserFollow.created_at.desc())
    ).all()
    
    return [UserSummary(id=u.id, username=u.username, created_at=u.created_at) for u in following]

@router.get("/check/{username}")
def check_following(
    username: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Get the target user
    target_user = session.exec(select(User).where(User.username == username)).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if following
    follow = session.exec(
        select(UserFollow).where(
            UserFollow.follower_id == current_user.id,
            UserFollow.followed_id == target_user.id
        )
    ).first()
    
    return {"is_following": follow is not None}
