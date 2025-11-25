from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from database import get_session
from database import get_session
from models import User, UserList, UserRead, UserStats, Vote, UserFollow, UserShowAttendance

router = APIRouter(prefix="/users", tags=["users"])

from routes.auth import get_current_user, get_current_user_optional

@router.get("/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Compute stats
    reviews_count = session.exec(select(Vote).where(Vote.user_id == current_user.id)).all()
    followers_count = session.exec(select(UserFollow).where(UserFollow.followed_id == current_user.id)).all()
    following_count = session.exec(select(UserFollow).where(UserFollow.follower_id == current_user.id)).all()
    shows_attended = session.exec(select(UserShowAttendance).where(UserShowAttendance.user_id == current_user.id)).all()

    stats = UserStats(
        shows_attended=len(shows_attended),
        reviews_count=len(reviews_count),
        followers_count=len(followers_count),
        following_count=len(following_count)
    )
    
    return UserRead(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        created_at=current_user.created_at,
        stats=stats,
        is_following=False
    )

@router.get("/{username}", response_model=UserRead)
def read_user(
    username: str, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user_optional) # Optional auth
):
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Compute stats
    reviews_count = session.exec(select(Vote).where(Vote.user_id == user.id)).all()
    followers_count = session.exec(select(UserFollow).where(UserFollow.followed_id == user.id)).all()
    following_count = session.exec(select(UserFollow).where(UserFollow.follower_id == user.id)).all()
    shows_attended = session.exec(select(UserShowAttendance).where(UserShowAttendance.user_id == user.id)).all()

    is_following = False
    if current_user:
        follow_check = session.exec(
            select(UserFollow).where(
                UserFollow.follower_id == current_user.id,
                UserFollow.followed_id == user.id
            )
        ).first()
        if follow_check:
            is_following = True

    stats = UserStats(
        shows_attended=len(shows_attended),
        reviews_count=len(reviews_count),
        followers_count=len(followers_count),
        following_count=len(following_count)
    )
    
    return UserRead(
        id=user.id,
        username=user.username,
        email=user.email,
        created_at=user.created_at,
        stats=stats,
        is_following=is_following
    )

@router.post("/{username}/follow")
def follow_user(
    username: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    target_user = session.exec(select(User).where(User.username == username)).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if target_user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")
        
    existing = session.exec(
        select(UserFollow).where(
            UserFollow.follower_id == current_user.id,
            UserFollow.followed_id == target_user.id
        )
    ).first()
    
    if not existing:
        follow = UserFollow(follower_id=current_user.id, followed_id=target_user.id)
        session.add(follow)
        session.commit()
        
    return {"status": "success", "is_following": True}

@router.delete("/{username}/follow")
def unfollow_user(
    username: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    target_user = session.exec(select(User).where(User.username == username)).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    existing = session.exec(
        select(UserFollow).where(
            UserFollow.follower_id == current_user.id,
            UserFollow.followed_id == target_user.id
        )
    ).first()
    
    if existing:
        session.delete(existing)
        session.commit()
        
    return {"status": "success", "is_following": False}

@router.get("/{username}/followers", response_model=List[UserRead])
def get_followers(username: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    followers = session.exec(
        select(User)
        .join(UserFollow, User.id == UserFollow.follower_id)
        .where(UserFollow.followed_id == user.id)
    ).all()
    
    return [
        UserRead(
            id=u.id, username=u.username, email=u.email, created_at=u.created_at, is_following=False
        ) for u in followers
    ]

@router.get("/{username}/following", response_model=List[UserRead])
def get_following(username: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    following = session.exec(
        select(User)
        .join(UserFollow, User.id == UserFollow.followed_id)
        .where(UserFollow.follower_id == user.id)
    ).all()
    
    return [
        UserRead(
            id=u.id, username=u.username, email=u.email, created_at=u.created_at, is_following=False
        ) for u in following
    ]

@router.get("/me/feed", response_model=List[Vote])
def get_feed(
    limit: int = 20,
    offset: int = 0,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Get IDs of users being followed
    following_ids = session.exec(
        select(UserFollow.followed_id).where(UserFollow.follower_id == current_user.id)
    ).all()
    
    if not following_ids:
        return []
        
    # Fetch votes from these users
    from sqlalchemy.orm import selectinload
    from models import SongPerformance, PerformanceTag, ShowTag, Tag

    feed = session.exec(
        select(Vote)
        .where(Vote.user_id.in_(following_ids))
        .options(
            selectinload(Vote.performance).selectinload(SongPerformance.performance_tags).selectinload(PerformanceTag.tag),
            selectinload(Vote.show).selectinload(Show.show_tags).selectinload(ShowTag.tag),
            selectinload(Vote.user)
        )
        .order_by(Vote.created_at.desc())
        .limit(limit)
        .offset(offset)
    ).all()
    
    return feed

