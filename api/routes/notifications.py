from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select

from api.database import get_session
from api.models import Notification, User
from api.routes.auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])


class NotificationRead(BaseModel):
    id: int
    type: str
    actor_username: Optional[str] = None
    object_type: str
    object_id: int
    read_at: Optional[datetime]
    created_at: datetime


@router.get("/", response_model=List[NotificationRead])
def list_notifications(
    limit: int = 50,
    unread_only: bool = False,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = select(Notification).where(Notification.user_id == current_user.id)
    if unread_only:
        statement = statement.where(Notification.read_at.is_(None))

    notifications = session.exec(
        statement.order_by(Notification.created_at.desc()).limit(limit)
    ).all()

    actor_ids = {n.actor_id for n in notifications if n.actor_id}
    actors = {}
    if actor_ids:
        actor_rows = session.exec(select(User).where(User.id.in_(actor_ids))).all()
        actors = {user.id: user for user in actor_rows}

    return [
        NotificationRead(
            id=n.id,
            type=n.type,
            actor_username=actors.get(n.actor_id).username if n.actor_id in actors else None,
            object_type=n.object_type,
            object_id=n.object_id,
            read_at=n.read_at,
            created_at=n.created_at,
        )
        for n in notifications
    ]


@router.post("/{notification_id}/read", response_model=NotificationRead)
def mark_notification_read(
    notification_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    notification = session.get(Notification, notification_id)
    if not notification or notification.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Notification not found")

    if notification.read_at is None:
        notification.read_at = datetime.utcnow()
        session.add(notification)
        session.commit()
        session.refresh(notification)

    actor_username = None
    if notification.actor_id:
        actor = session.get(User, notification.actor_id)
        actor_username = actor.username if actor else None

    return NotificationRead(
        id=notification.id,
        type=notification.type,
        actor_username=actor_username,
        object_type=notification.object_type,
        object_id=notification.object_id,
        read_at=notification.read_at,
        created_at=notification.created_at,
    )


@router.post("/read-all")
def mark_all_read(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    notifications = session.exec(
        select(Notification).where(
            Notification.user_id == current_user.id,
            Notification.read_at.is_(None),
        )
    ).all()

    now = datetime.utcnow()
    for notification in notifications:
        notification.read_at = now
        session.add(notification)

    session.commit()
    return {"updated": len(notifications)}
