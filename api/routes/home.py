from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func, desc, SQLModel
from api.database import get_session
from api.models import ReviewComment, User, Vote, SongPerformance, Song, Show

router = APIRouter(prefix="/home", tags=["home"])

class RecentCommentRead(SQLModel):
    id: int
    user_id: int
    username: str
    body: str
    created_at: datetime
    song_name: str
    show_date: str

class TopMemberRead(SQLModel):
    id: int
    username: str
    vote_count: int

class RecentBlurbRead(SQLModel):
    id: int
    user_id: int
    username: str
    blurb: str
    rating: int
    created_at: datetime
    song_name: str
    show_date: str

@router.get("/recent-comments", response_model=List[RecentCommentRead])
def get_recent_comments(limit: int = 5, session: Session = Depends(get_session)):
    """Get most recent comments on votes."""
    query = select(ReviewComment).order_by(desc(ReviewComment.created_at)).limit(limit)
    comments = session.exec(query).all()
    
    results = []
    for comment in comments:
        # Need to join to get context. This is a bit N+1 but fine for small limit.
        # Ideally we'd do a joined load.
        vote = session.get(Vote, comment.vote_id)
        if vote and vote.performance:
            results.append(RecentCommentRead(
                id=comment.id,
                user_id=comment.user_id,
                username=comment.user.username,
                body=comment.body,
                created_at=comment.created_at,
                song_name=vote.performance.song.name,
                show_date=vote.performance.show.date
            ))
    return results

@router.get("/top-members", response_model=List[TopMemberRead])
def get_top_members(limit: int = 5, session: Session = Depends(get_session)):
    """Get members with the most votes."""
    # This is a simplified "top member" metric. Could be more complex.
    query = (
        select(User, func.count(Vote.id).label("vote_count"))
        .join(Vote)
        .group_by(User.id)
        .order_by(desc("vote_count"))
        .limit(limit)
    )
    results = session.exec(query).all()
    
    return [
        TopMemberRead(id=user.id, username=user.username, vote_count=count)
        for user, count in results
    ]

@router.get("/recent-blurbs", response_model=List[RecentBlurbRead])
def get_recent_blurbs(limit: int = 5, session: Session = Depends(get_session)):
    """Get recent votes that have a blurb."""
    query = (
        select(Vote)
        .where(Vote.blurb != None)
        .order_by(desc(Vote.created_at))
        .limit(limit)
    )
    votes = session.exec(query).all()
    
    results = []
    for vote in votes:
        if vote.performance:
            results.append(RecentBlurbRead(
                id=vote.id,
                user_id=vote.user_id,
                username=vote.user.username,
                blurb=vote.blurb,
                rating=vote.rating,
                created_at=vote.created_at,
                song_name=vote.performance.song.name,
                show_date=vote.performance.show.date
            ))
    return results
