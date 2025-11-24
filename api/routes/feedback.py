from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from pydantic import BaseModel

from api.database import get_session
from api.models import Feedback, User
from api.routes.auth import get_current_user, get_current_user_optional

router = APIRouter(prefix="/feedback", tags=["feedback"])

class FeedbackCreate(BaseModel):
    type: str
    subject: str
    message: str

@router.post("/", response_model=Feedback)
def create_feedback(
    feedback_data: FeedbackCreate,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    feedback = Feedback(
        user_id=current_user.id if current_user else None,
        type=feedback_data.type,
        subject=feedback_data.subject,
        message=feedback_data.message
    )
    session.add(feedback)
    session.commit()
    session.refresh(feedback)
    return feedback

@router.get("/", response_model=List[Feedback])
def list_feedback(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # TODO: Add admin check here
    statement = select(Feedback).order_by(Feedback.created_at.desc())
    return session.exec(statement).all()
