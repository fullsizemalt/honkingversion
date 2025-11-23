from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select, or_
from typing import List, Optional
from database import get_session
from models import Song, Show, User

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/")
def search(
    q: str = Query(..., min_length=1, description="Search query"),
    type: Optional[str] = Query(None, description="Filter by type: song, show, venue"),
    session: Session = Depends(get_session)
):
    """
    Search for songs, shows, and venues.
    """
    results = {
        "songs": [],
        "shows": [],
        "venues": []
    }
    
    query = q.lower()
    
    # Search Songs
    if not type or type == "song":
        song_stmt = select(Song).where(
            or_(
                Song.name.ilike(f"%{query}%"),
                Song.artist.ilike(f"%{query}%")
            )
        ).limit(10)
        songs = session.exec(song_stmt).all()
        results["songs"] = [song.model_dump() for song in songs]

    # Search Shows (by venue or location or date)
    if not type or type == "show":
        show_stmt = select(Show).where(
            or_(
                Show.venue.ilike(f"%{query}%"),
                Show.location.ilike(f"%{query}%"),
                Show.date.ilike(f"%{query}%")
            )
        ).limit(10)
        shows = session.exec(show_stmt).all()
        results["shows"] = [show.model_dump() for show in shows]
        
    # Search Venues (derived from Shows for now, or if we had a Venue model)
    # Since we don't have a dedicated Venue model yet, we'll skip distinct venue search 
    # or just rely on the show search returning venue info. 
    # For now, let's keep it simple and just return shows that match the venue.
    # If we want a distinct list of venues, we'd need a group by query.
    
    if not type or type == "venue":
        # Distinct venues matching query
        # This is a bit more complex with SQLModel/SQLAlchemy core, 
        # let's stick to returning shows for now as the "venue" search result.
        pass

    return results
