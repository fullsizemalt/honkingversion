from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional

from ..database import get_session
from ..models import Show
from ..services.elgoose import SetlistClient
from ..services.date_parser import parse_date

router = APIRouter(prefix="/shows", tags=["shows"])

@router.get("/{date_str}")
def get_show(date_str: str, session: Session = Depends(get_session)):
    # 1. Check DB
    statement = select(Show).where(Show.date == date_str)
    show = session.exec(statement).first()
    
    if show:
        return show
        
    # 2. Fetch from El Goose
    try:
        date_obj = parse_date(date_str)
        if not date_obj:
             raise HTTPException(status_code=400, detail="Invalid date format")
             
        setlist_text = SetlistClient.get_setlist(date_obj)
        if not setlist_text:
            raise HTTPException(status_code=404, detail="Show not found")
            
        # In a real implementation, we would parse the detailed JSON from El Goose 
        # and save it to our DB. For now, we just return the text.
        return {"date": date_str, "setlist": setlist_text, "source": "elgoose_api"}
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")
    except Exception as e:
        print(f"Error fetching show {date_str}: {e}") # Log the error
        raise HTTPException(status_code=404, detail="Show not found")

@router.get("/")
def list_shows(session: Session = Depends(get_session)):
    statement = select(Show).limit(10)
    shows = session.exec(statement).all()
    return shows
