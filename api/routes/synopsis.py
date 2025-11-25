from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

from api.database import get_session
from api.models import Synopsis, SynopsisHistory, User, ObjectType
from api.routes.auth import get_current_user, get_current_user_optional

router = APIRouter(prefix="/synopsis", tags=["synopsis"])

@router.get("/{object_type}/{object_id}")
def get_synopsis(
    object_type: str,
    object_id: int,
    session: Session = Depends(get_session)
):
    """Get the current synopsis for an object"""
    statement = select(Synopsis).where(
        Synopsis.object_type == object_type,
        Synopsis.object_id == object_id
    )
    synopsis = session.exec(statement).first()
    
    if not synopsis:
        # Return empty structure if not found, rather than 404, to simplify frontend
        return {
            "content": "",
            "version": 0,
            "last_updated_at": None,
            "last_updated_by": None
        }
        
    return synopsis

@router.post("/{object_type}/{object_id}")
def update_synopsis(
    object_type: str,
    object_id: int,
    content: str,
    version: int,
    change_summary: Optional[str] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Create or update a synopsis"""
    # Validate object type
    try:
        ObjectType(object_type)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid object type")

    # Check for existing synopsis
    statement = select(Synopsis).where(
        Synopsis.object_type == object_type,
        Synopsis.object_id == object_id
    )
    synopsis = session.exec(statement).first()
    
    if synopsis:
        # Optimistic locking check
        if synopsis.version != version:
            raise HTTPException(
                status_code=409, 
                detail="Conflict: Synopsis has been modified by another user. Please refresh and try again."
            )
        
        # Update existing
        synopsis.content = content
        synopsis.version += 1
        synopsis.last_updated_at = datetime.utcnow()
        synopsis.last_updated_by_id = current_user.id
        
    else:
        # Create new
        synopsis = Synopsis(
            object_type=object_type,
            object_id=object_id,
            content=content,
            version=1,
            last_updated_by_id=current_user.id
        )
        session.add(synopsis)
        session.flush() # Get ID
        
    # Create history entry
    history = SynopsisHistory(
        synopsis_id=synopsis.id,
        content=content,
        edited_by_id=current_user.id,
        change_summary=change_summary,
        version=synopsis.version
    )
    session.add(history)
    
    session.commit()
    session.refresh(synopsis)
    return synopsis

@router.get("/{object_type}/{object_id}/history")
def get_synopsis_history(
    object_type: str,
    object_id: int,
    session: Session = Depends(get_session)
):
    """Get edit history for a synopsis"""
    # First find the synopsis
    statement = select(Synopsis).where(
        Synopsis.object_type == object_type,
        Synopsis.object_id == object_id
    )
    synopsis = session.exec(statement).first()
    
    if not synopsis:
        return []
        
    # Get history
    history_statement = select(SynopsisHistory).where(
        SynopsisHistory.synopsis_id == synopsis.id
    ).order_by(SynopsisHistory.edited_at.desc())
    
    history = session.exec(history_statement).all()
    return history
