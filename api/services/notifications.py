from datetime import datetime
from sqlmodel import Session

from typing import Optional

from models import Notification

def create_notification(
    session: Session,
    *,
    user_id: int,
    type: str,
    object_type: str,
    object_id: int,
    actor_id: Optional[int] = None,
) -> Optional[Notification]:
    """
    Persist a notification for a user. Returns the created notification or None if skipped.
    Currently avoids notifying a user about their own actions.
    """
    if actor_id and actor_id == user_id:
        return None

    notification = Notification(
        user_id=user_id,
        type=type,
        actor_id=actor_id,
        object_type=object_type,
        object_id=object_id,
        created_at=datetime.utcnow(),
    )
    session.add(notification)
    session.commit()
    session.refresh(notification)
    return notification
