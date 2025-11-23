from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, col
from typing import List, Optional
from pydantic import BaseModel

from database import get_session
from models import Show, Song, User

router = APIRouter(prefix="/search", tags=["search"])

class SearchResult(BaseModel):
    type: str  # 'show', 'song', 'user'
    id: int
    title: str
    subtitle: Optional[str] = None
    url: str

@router.get("/", response_model=List[SearchResult])
def search(
    q: str,
    session: Session = Depends(get_session)
):
    if not q or len(q) < 2:
        return []
        
    results = []
    query_str = f"%{q}%"
    
    # Search Songs
    songs = session.exec(
        select(Song)
        .where(col(Song.name).like(query_str))
        .limit(5)
    ).all()
    
    for song in songs:
        results.append(SearchResult(
            type="song",
            id=song.id,
            title=song.name,
            subtitle=song.artist,
            url=f"/songs/{song.slug}"
        ))
        
    # Search Shows (by venue or location)
    shows = session.exec(
        select(Show)
        .where(
            (col(Show.venue).like(query_str)) | 
            (col(Show.location).like(query_str)) |
            (col(Show.date).like(query_str))
        )
        .order_by(Show.date.desc())
        .limit(5)
    ).all()
    
    for show in shows:
        results.append(SearchResult(
            type="show",
            id=show.id,
            title=f"{show.date} - {show.venue}",
            subtitle=show.location,
            url=f"/shows/{show.date}"
        ))
        
    # Search Users
    users = session.exec(
        select(User)
        .where(col(User.username).like(query_str))
        .limit(5)
    ).all()
    
    for user in users:
        results.append(SearchResult(
            type="user",
            id=user.id,
            title=user.username,
            subtitle="User",
            url=f"/u/{user.username}"
        ))
        
    return results
