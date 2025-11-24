from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from database import get_session
from models import User, UserTitle, UserBadge, Vote, UserList, ListFollow, UserShowAttendance
from routes.auth import get_current_user_optional
import json

router = APIRouter(prefix="/profile", tags=["profile"])

class ProfileStats:
    shows_attended: int
    total_votes: int
    lists_created: int
    followers: int
    following: int

class ProfileData:
    user: User
    stats: ProfileStats
    selected_title: Optional[UserTitle]
    badges: List[UserBadge]
    recent_activity: List[Vote]

@router.get("/{username}")
def get_user_profile(
    username: str,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Get comprehensive profile data for a user"""
    # Get user
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get stats
    shows_attended = session.exec(
        select(func.count(UserShowAttendance.show_id))
        .where(UserShowAttendance.user_id == user.id)
    ).one()
    
    total_votes = session.exec(
        select(func.count(Vote.id))
        .where(Vote.user_id == user.id)
    ).one()
    
    lists_created = session.exec(
        select(func.count(UserList.id))
        .where(UserList.user_id == user.id)
    ).one()
    
    # Get selected title
    selected_title = None
    if user.selected_title_id:
        selected_title = session.get(UserTitle, user.selected_title_id)
    
    # Get badges (limit to 10 most recent)
    badges_statement = select(UserBadge).where(
        UserBadge.user_id == user.id
    ).order_by(UserBadge.earned_at.desc()).limit(10)
    badges = session.exec(badges_statement).all()
    
    # Get recent activity (last 20 votes)
    activity_statement = select(Vote).where(
        Vote.user_id == user.id
    ).order_by(Vote.created_at.desc()).limit(20)
    recent_activity = session.exec(activity_statement).all()
    
    # Parse social links
    social_links = {}
    if user.social_links:
        try:
            social_links = json.loads(user.social_links)
        except:
            social_links = {}
    
    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "display_name": user.display_name,
            "bio": user.bio,
            "profile_picture_url": user.profile_picture_url,
            "role": user.role,
            "created_at": user.created_at,
            "social_links": social_links
        },
        "stats": {
            "shows_attended": shows_attended,
            "total_votes": total_votes,
            "lists_created": lists_created,
            "followers": 0,  # TODO: implement followers
            "following": 0   # TODO: implement following
        },
        "selected_title": selected_title,
        "badges": badges,
        "recent_activity": recent_activity
    }

@router.get("/{username}/titles")
def get_user_titles(
    username: str,
    session: Session = Depends(get_session)
):
    """Get all titles earned by a user"""
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    titles_statement = select(UserTitle).where(
        UserTitle.user_id == user.id
    ).order_by(UserTitle.earned_at.desc())
    
    titles = session.exec(titles_statement).all()
    return titles

@router.get("/{username}/badges")
def get_user_badges(
    username: str,
    session: Session = Depends(get_session)
):
    """Get all badges earned by a user"""
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    badges_statement = select(UserBadge).where(
        UserBadge.user_id == user.id
    ).order_by(UserBadge.earned_at.desc())
    
    badges = session.exec(badges_statement).all()
    return badges

@router.get("/{username}/activity")
def get_user_activity(
    username: str,
    filter: Optional[str] = None,  # votes, blurbs, reviews, comments
    limit: int = 20,
    session: Session = Depends(get_session)
):
    """Get user activity with optional filtering"""
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Base query
    activity_statement = select(Vote).where(Vote.user_id == user.id)
    
    # Apply filters
    if filter == "blurbs":
        activity_statement = activity_statement.where(Vote.blurb != None)
    elif filter == "reviews":
        activity_statement = activity_statement.where(Vote.full_review != None)
    
    activity_statement = activity_statement.order_by(Vote.created_at.desc()).limit(limit)
    
    activity = session.exec(activity_statement).all()
    return activity

@router.get("/{username}/lists/followed")
def get_followed_lists(
    username: str,
    session: Session = Depends(get_session)
):
    """Get lists followed by a user"""
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get followed list IDs
    follows_statement = select(ListFollow).where(ListFollow.user_id == user.id)
    follows = session.exec(follows_statement).all()
    
    list_ids = [f.list_id for f in follows]
    
    if not list_ids:
        return []
    
    # Get the actual lists
    lists_statement = select(UserList).where(UserList.id.in_(list_ids))
    lists = session.exec(lists_statement).all()
    
    return lists
