from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from typing import List, Optional

from database import get_session
from models import Song, SongPerformance, Show

router = APIRouter(prefix="/songs", tags=["songs"])

@router.get("/")
def list_songs(session: Session = Depends(get_session)):
    """List all songs with aggregated stats"""
    statement = select(Song)
    songs = session.exec(statement).all()
    
    # Add performance counts for each song
    result = []
    for song in songs:
        perf_count = session.exec(
            select(func.count(SongPerformance.id))
            .where(SongPerformance.song_id == song.id)
        ).one()
        
        song_dict = song.model_dump()
        song_dict['times_played'] = perf_count
        result.append(song_dict)
    
    return result

@router.get("/{slug}")
def get_song(slug: str, session: Session = Depends(get_session)):
    """Get song details with all performances"""
    statement = select(Song).where(Song.slug == slug)
    song = session.exec(statement).first()
    
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    
    # Get all performances for this song
    perf_statement = (
        select(SongPerformance, Show)
        .join(Show, SongPerformance.show_id == Show.id)
        .where(SongPerformance.song_id == song.id)
        .order_by(Show.date.desc())
    )
    
    performances_with_shows = session.exec(perf_statement).all()
    
    performances = []
    for perf, show in performances_with_shows:
        performances.append({
            "id": perf.id,
            "position": perf.position,
            "set_number": perf.set_number,
            "notes": perf.notes,
            "show": {
                "id": show.id,
                "date": show.date,
                "venue": show.venue,
                "location": show.location
            }
        })
    
    return {
        **song.model_dump(),
        "performances": performances,
        "times_played": len(performances)
    }
