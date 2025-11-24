from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from typing import List, Optional
from pydantic import BaseModel

from database import get_session
from models import SongPerformance, Song, Show, Vote, User
from routes.auth import get_current_user

router = APIRouter(prefix="/performances", tags=["performances"])

@router.get("/")
def list_performances(
    limit: int = 20,
    session: Session = Depends(get_session)
):
    """List recent performances with song and show details"""
    statement = (
        select(SongPerformance, Song, Show)
        .join(Song, SongPerformance.song_id == Song.id)
        .join(Show, SongPerformance.show_id == Show.id)
        .order_by(Show.date.desc(), SongPerformance.position)
        .limit(limit)
    )
    
    results = session.exec(statement).all()
    
    performances = []
    for perf, song, show in results:
        # Get vote count and average for this performance
        vote_statement = select(Vote).where(Vote.performance_id == perf.id)
        votes = session.exec(vote_statement).all()
        
        avg_rating = None
        if votes:
            avg_rating = sum(v.rating for v in votes) / len(votes)
        
        performances.append({
            "id": perf.id,
            "position": perf.position,
            "set_number": perf.set_number,
            "notes": perf.notes,
            "song": {
                "id": song.id,
                "name": song.name,
                "slug": song.slug,
                "is_cover": song.is_cover,
                "original_artist": song.original_artist
            },
            "show": {
                "id": show.id,
                "date": show.date,
                "venue": show.venue,
                "location": show.location
            },
            "vote_count": len(votes),
            "avg_rating": round(avg_rating, 1) if avg_rating else None
        })
    
    return performances


@router.get("/top-rated")
def list_top_rated_performances(
    limit: int = 10,
    min_votes: int = 1,
    session: Session = Depends(get_session)
):
    """
    Return the highest-rated performances by average vote.
    Only performances with at least ``min_votes`` are considered.
    """
    statement = (
        select(
            SongPerformance,
            Song,
            Show,
            func.count(Vote.id).label("vote_count"),
            func.avg(Vote.rating).label("avg_rating")
        )
        .join(Song, SongPerformance.song_id == Song.id)
        .join(Show, SongPerformance.show_id == Show.id)
        .join(Vote, Vote.performance_id == SongPerformance.id)
        .group_by(SongPerformance.id, Song.id, Show.id)
        .having(func.count(Vote.id) >= min_votes)
        .order_by(func.avg(Vote.rating).desc(), func.count(Vote.id).desc())
        .limit(limit)
    )

    results = session.exec(statement).all()
    top_performances = []
    for perf, song, show, vote_count, avg_rating in results:
        top_performances.append({
            "id": perf.id,
            "position": perf.position,
            "set_number": perf.set_number,
            "notes": perf.notes,
            "song": {
                "id": song.id,
                "name": song.name,
                "slug": song.slug,
                "is_cover": song.is_cover,
                "original_artist": song.original_artist
            },
            "show": {
                "id": show.id,
                "date": show.date,
                "venue": show.venue,
                "location": show.location
            },
            "vote_count": vote_count,
            "avg_rating": round(avg_rating, 1) if avg_rating else None
        })

    return top_performances

@router.get("/{performance_id}")
def get_performance(
    performance_id: int,
    session: Session = Depends(get_session)
):
    """Get specific performance details"""
    statement = (
        select(SongPerformance, Song, Show)
        .join(Song, SongPerformance.song_id == Song.id)
        .join(Show, SongPerformance.show_id == Show.id)
        .where(SongPerformance.id == performance_id)
    )
    
    result = session.exec(statement).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Performance not found")
    
    perf, song, show = result
    
    # Get votes
    vote_statement = select(Vote).where(Vote.performance_id == perf.id)
    votes = session.exec(vote_statement).all()
    
    avg_rating = None
    if votes:
        avg_rating = sum(v.rating for v in votes) / len(votes)
    
    return {
        "id": perf.id,
        "position": perf.position,
        "set_number": perf.set_number,
        "notes": perf.notes,
        "song": song.model_dump(),
        "show": show.model_dump(),
        "vote_count": len(votes),
        "avg_rating": round(avg_rating, 1) if avg_rating else None
    }

class PerformanceVoteCreate(BaseModel):
    rating: int
    blurb: Optional[str] = None
    full_review: Optional[str] = None

@router.get("/{performance_id}/rating")
def get_performance_rating(
    performance_id: int,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Get rating stats for a performance"""
    # Verify performance exists
    perf = session.get(SongPerformance, performance_id)
    if not perf:
        raise HTTPException(status_code=404, detail="Performance not found")
    
    # Get all votes
    vote_statement = select(Vote).where(Vote.performance_id == performance_id)
    votes = session.exec(vote_statement).all()
    
    avg_rating = None
    if votes:
        avg_rating = sum(v.rating for v in votes) / len(votes)
    
    # Get user's vote if authenticated
    user_vote = None
    if current_user:
        user_vote_statement = select(Vote).where(
            Vote.performance_id == performance_id,
            Vote.user_id == current_user.id
        )
        user_vote_obj = session.exec(user_vote_statement).first()
        if user_vote_obj:
            user_vote = user_vote_obj.rating
    
    return {
        "performance_id": performance_id,
        "avg_rating": round(avg_rating, 1) if avg_rating else None,
        "vote_count": len(votes),
        "user_vote": user_vote
    }

@router.post("/{performance_id}/vote")
def vote_on_performance(
    performance_id: int,
    vote_data: PerformanceVoteCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Vote on a specific performance"""
    # Verify performance exists
    perf = session.get(SongPerformance, performance_id)
    if not perf:
        raise HTTPException(status_code=404, detail="Performance not found")
    
    # Validate rating
    if vote_data.rating < 1 or vote_data.rating > 10:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 10")
    
    # Check if user already voted
    existing_vote_statement = select(Vote).where(
        Vote.performance_id == performance_id,
        Vote.user_id == current_user.id
    )
    existing_vote = session.exec(existing_vote_statement).first()
    
    if existing_vote:
        # Update existing vote
        existing_vote.rating = vote_data.rating
        existing_vote.blurb = vote_data.blurb
        existing_vote.full_review = vote_data.full_review
        session.add(existing_vote)
        session.commit()
        session.refresh(existing_vote)
        return {"message": "Vote updated", "vote_id": existing_vote.id, "rating": existing_vote.rating}
    else:
        # Create new vote
        new_vote = Vote(
            user_id=current_user.id,
            performance_id=performance_id,
            rating=vote_data.rating,
            blurb=vote_data.blurb,
            full_review=vote_data.full_review
        )
        session.add(new_vote)
        session.commit()
        session.refresh(new_vote)
        return {"message": "Vote created", "vote_id": new_vote.id, "rating": new_vote.rating}
