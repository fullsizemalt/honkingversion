from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from typing import List, Optional

from database import get_session
from models import Show, SongPerformance, Song
from services.show_fetcher import ShowFetcher
from services.date_parser import parse_date

router = APIRouter(prefix="/shows", tags=["shows"])

@router.get("/{date_str}")
def get_show(date_str: str, session: Session = Depends(get_session)):
    """
    Get show details by date.

    - Checks database first
    - If not found, fetches from El Goose API and populates database
    - Returns full show data with setlist

    Args:
        date_str: Date in YYYY-MM-DD format

    Returns:
        Show object with venue, location, setlist data, and performances

    Raises:
        400: Invalid date format
        404: Show not found in either database or El Goose API
    """
    try:
        # Validate date format
        date_obj = parse_date(date_str)
        if not date_obj:
            raise HTTPException(status_code=400, detail="Invalid date format (use YYYY-MM-DD)")

        # Get or fetch show (on-demand population)
        show = ShowFetcher.get_or_fetch_show(session, date_str)

        if not show:
            raise HTTPException(
                status_code=404,
                detail=f"No show found for {date_str}"
            )

        return show

    except HTTPException:
        raise
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format (use YYYY-MM-DD)")
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching show: {str(e)}"
        )

@router.get("/")
def list_shows(session: Session = Depends(get_session)):
    statement = select(Show).limit(10)
    shows = session.exec(statement).all()
    return shows

@router.get("/years")
def list_years(session: Session = Depends(get_session)):
    years = session.exec(
        select(func.substr(Show.date, 1, 4)).distinct().order_by(func.substr(Show.date, 1, 4).desc())
    ).all()
    return [y for y in years if y]

@router.get("/years/{year}")
def shows_by_year(year: str, session: Session = Depends(get_session)):
    statement = (
        select(Show)
        .where(Show.date.like(f"{year}-%"))
        .order_by(Show.date.asc())
    )
    shows = session.exec(statement).all()
    if not shows:
        raise HTTPException(status_code=404, detail="No shows for year")
    return shows

@router.get("/{date_str}/performances")
def get_show_performances(date_str: str, session: Session = Depends(get_session)):
    """
    Get all performances for a show by date.
    Returns performances with song details, ordered by set and position.
    """
    # First get the show
    statement = select(Show).where(Show.date == date_str)
    show = session.exec(statement).first()
    
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    
    # Get performances with song details
    perf_statement = (
        select(SongPerformance, Song)
        .join(Song, SongPerformance.song_id == Song.id)
        .where(SongPerformance.show_id == show.id)
        .order_by(SongPerformance.set_number, SongPerformance.position)
    )
    
    results = session.exec(perf_statement).all()
    
    performances = []
    for perf, song in results:
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
            }
        })
    
    return performances
