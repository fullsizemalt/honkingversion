from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import Show
from typing import List, Dict
import re

router = APIRouter(prefix="/venues", tags=["venues"])

def slugify(text: str) -> str:
    """Simple slugify for venue names"""
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip('-')

@router.get("/", response_model=List[Dict[str, str]])
def list_venues(session: Session = Depends(get_session)):
    """Return a list of distinct venues with slug and display name"""
    stmt = select(Show.venue).distinct()
    results = session.exec(stmt).all()
    venues = []
    for venue in results:
        venues.append({"name": venue, "slug": slugify(venue)})
    return venues

@router.get("/{venue_slug}", response_model=Dict)
def venue_detail(venue_slug: str, session: Session = Depends(get_session)):
    """Return venue info and all shows at that venue"""
    stmt = select(Show).where(Show.venue != None)
    shows = session.exec(stmt).all()
    # Find matching venue
    matching = [s for s in shows if slugify(s.venue) == venue_slug]
    if not matching:
        raise HTTPException(status_code=404, detail="Venue not found")
    venue_name = matching[0].venue
    # Build list of shows
    show_list = []
    for s in matching:
        show_list.append({
            "id": s.id,
            "date": s.date,
            "location": s.location,
            "elgoose_id": s.elgoose_id,
        })
    # Simple stats: count of shows
    stats = {"show_count": len(show_list)}
    return {"name": venue_name, "slug": venue_slug, "stats": stats, "shows": show_list}
