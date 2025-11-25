from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlmodel import Session, select, func
from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime, timedelta
import json

from api.database import get_session
from api.models import AnalyticsEvent, User
from api.routes.auth import get_current_user_optional

router = APIRouter(prefix="/analytics", tags=["analytics"])

class EventCreate(BaseModel):
    event_type: str
    path: str
    metadata: Optional[Dict[str, Any]] = None
    session_id: str

@router.post("/event")
async def track_event(
    event: EventCreate,
    background_tasks: BackgroundTasks,
    current_user: Optional[User] = Depends(get_current_user_optional),
    session: Session = Depends(get_session)
):
    """
    Track a user event.
    """
    # Use background task to avoid blocking the response
    background_tasks.add_task(
        save_event, 
        event, 
        current_user.id if current_user else None, 
        session
    )
    return {"status": "ok"}

def save_event(event: EventCreate, user_id: Optional[int], session: Session):
    """
    Save event to database.
    """
    db_event = AnalyticsEvent(
        event_type=event.event_type,
        path=event.path,
        metadata_json=json.dumps(event.metadata) if event.metadata else None,
        session_id=event.session_id,
        user_id=user_id
    )
    session.add(db_event)
    session.commit()

@router.get("/stats")
async def get_stats(
    period: str = "24h",
    session: Session = Depends(get_session)
):
    """
    Get basic analytics stats.
    """
    now = datetime.utcnow()
    if period == "24h":
        start_time = now - timedelta(hours=24)
    elif period == "7d":
        start_time = now - timedelta(days=7)
    elif period == "30d":
        start_time = now - timedelta(days=30)
    else:
        start_time = now - timedelta(hours=24)

    # Total page views
    query = select(func.count(AnalyticsEvent.id)).where(
        AnalyticsEvent.event_type == "page_view",
        AnalyticsEvent.timestamp >= start_time
    )
    page_views = session.exec(query).one()

    # Top pages
    top_pages_query = select(
        AnalyticsEvent.path, 
        func.count(AnalyticsEvent.id).label("count")
    ).where(
        AnalyticsEvent.event_type == "page_view",
        AnalyticsEvent.timestamp >= start_time
    ).group_by(AnalyticsEvent.path).order_by(func.count(AnalyticsEvent.id).desc()).limit(10)
    
    top_pages = session.exec(top_pages_query).all()

    return {
        "period": period,
        "page_views": page_views,
        "top_pages": [{"path": path, "count": count} for path, count in top_pages]
    }
