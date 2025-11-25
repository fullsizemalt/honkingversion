from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from api.database import get_session
from api.models import ChangelogEntry, User, UserRead
from api.routes.auth import get_current_user, get_admin_user

router = APIRouter(prefix="/changelog", tags=["changelog"])

class ChangelogCreate(BaseModel):
    title: str
    description: str
    type: str
    credited_user_id: Optional[int] = None

class ChangelogRead(BaseModel):
    id: int
    title: str
    description: str
    date: datetime
    type: str
    credited_user: Optional[UserRead] = None

@router.get("/", response_model=List[ChangelogRead])
def get_changelog(session: Session = Depends(get_session)):
    statement = select(ChangelogEntry).order_by(ChangelogEntry.date.desc())
    entries = session.exec(statement).all()
    return entries

@router.post("/", response_model=ChangelogEntry)
def create_changelog_entry(
    entry_data: ChangelogCreate,
    session: Session = Depends(get_session),
    admin_user: User = Depends(get_admin_user)
):
    """Create a changelog entry (admin only)."""
    entry = ChangelogEntry(
        title=entry_data.title,
        description=entry_data.description,
        type=entry_data.type,
        credited_user_id=entry_data.credited_user_id
    )
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry
