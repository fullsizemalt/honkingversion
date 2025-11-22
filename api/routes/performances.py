from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional

from ..database import get_session
from ..models import SongPerformance, Song, Show, Vote

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
