from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional

from database import get_session
from models import Show
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
