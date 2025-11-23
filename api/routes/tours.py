from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Dict

from database import get_session
from models import Show

router = APIRouter(prefix="/tours", tags=["tours"])


@router.get("/", response_model=List[Dict[str, str]])
def list_tours(session: Session = Depends(get_session)):
    tours = session.exec(
        select(Show.tour)
        .where(Show.tour.is_not(None))
        .distinct()
        .order_by(Show.tour)
    ).all()
    return [{"name": tour} for tour in tours if tour]


@router.get("/{tour_name}", response_model=Dict)
def tour_detail(tour_name: str, session: Session = Depends(get_session)):
    shows = session.exec(
        select(Show).where(Show.tour == tour_name).order_by(Show.date.asc())
    ).all()
    if not shows:
        raise HTTPException(status_code=404, detail="Tour not found or empty")

    show_list = [
        {
            "id": s.id,
            "date": s.date,
            "venue": s.venue,
            "location": s.location,
        }
        for s in shows
    ]
    return {"tour": tour_name, "shows": show_list, "show_count": len(show_list)}
