from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from typing import List, Optional

from database import get_session
from models import Song, SongPerformance, Show, Vote

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

@router.get("/id/{song_id}")
def get_song_by_id(song_id: int, session: Session = Depends(get_session)):
    song = session.get(Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return song

@router.get("/{slug}/performances")
def get_song_performances(slug: str, session: Session = Depends(get_session)):
    """Return performances for a song with rating stats, sorted by avg rating descending"""
    # Find song
    song = session.exec(select(Song).where(Song.slug == slug)).first()
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")

    # Gather performances with show info
    perf_stmt = (
        select(SongPerformance, Show)
        .join(Show, SongPerformance.show_id == Show.id)
        .where(SongPerformance.song_id == song.id)
    )
    perf_rows = session.exec(perf_stmt).all()

    results = []
    for perf, show in perf_rows:
        # Rating aggregation for this performance
        vote_stmt = select(Vote).where(Vote.performance_id == perf.id)
        votes = session.exec(vote_stmt).all()
        avg = None
        if votes:
            avg = round(sum(v.rating for v in votes) / len(votes), 1)
        results.append({
            "id": perf.id,
            "position": perf.position,
            "set_number": perf.set_number,
            "notes": perf.notes,
            "show": {
                "id": show.id,
                "date": show.date,
                "venue": show.venue,
                "location": show.location,
            },
            "avg_rating": avg,
            "vote_count": len(votes),
        })

    # Sort by avg rating (None values go last)
    results.sort(key=lambda x: (x["avg_rating"] is None, -(x["avg_rating"] or 0)))
    return results
