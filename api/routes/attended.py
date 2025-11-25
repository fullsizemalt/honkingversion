from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from pydantic import BaseModel
from datetime import datetime

from database import get_session
from models import User, Show, UserShowAttendance
from routes.auth import get_current_user

router = APIRouter(prefix="/attended", tags=["attended"])

class AttendedShowRead(BaseModel):
    show_id: int
    date: str
    venue: str
    location: str
    created_at: datetime

@router.post("/{show_id}")
def mark_attended(
    show_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    show = session.get(Show, show_id)
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
        
    # Check if already attended
    existing = session.get(UserShowAttendance, (current_user.id, show_id))
    if existing:
        return {"message": "Already marked as attended"}
        
    attendance = UserShowAttendance(user_id=current_user.id, show_id=show_id)
    session.add(attendance)
    session.commit()
    return {"message": "Marked as attended"}

@router.delete("/{show_id}")
def unmark_attended(
    show_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    attendance = session.get(UserShowAttendance, (current_user.id, show_id))
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")
        
    session.delete(attendance)
    session.commit()
    return {"message": "Unmarked as attended"}

@router.get("/user/{username}", response_model=List[AttendedShowRead])
def get_user_attended_shows(
    username: str,
    session: Session = Depends(get_session)
):
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Join UserShowAttendance with Show to get details
    results = session.exec(
        select(UserShowAttendance, Show)
        .join(Show)
        .where(UserShowAttendance.user_id == user.id)
        .order_by(Show.date.desc())
    ).all()
    
    attended_shows = []
    for attendance, show in results:
        attended_shows.append(AttendedShowRead(
            show_id=show.id,
            date=show.date,
            venue=show.venue,
            location=show.location,
            created_at=attendance.created_at
        ))
        
    return attended_shows

@router.get("/me", response_model=List[AttendedShowRead])
def get_my_attended_shows(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    results = session.exec(
        select(UserShowAttendance, Show)
        .join(Show)
        .where(UserShowAttendance.user_id == current_user.id)
        .order_by(Show.date.desc())
    ).all()

    attended_shows = []
    for attendance, show in results:
        attended_shows.append(AttendedShowRead(
            show_id=show.id,
            date=show.date,
            venue=show.venue,
            location=show.location,
            created_at=attendance.created_at
        ))

    return attended_shows

@router.get("/check/{show_id}")
def check_attendance(
    show_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    existing = session.get(UserShowAttendance, (current_user.id, show_id))
    return {"attended": existing is not None}
