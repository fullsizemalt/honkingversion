from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select
from database import get_session
from models import User, Vote, Show, SongPerformance, Song, UserShowAttendance, UserFollow, UserList
from routes.auth import get_current_user, get_current_user_optional
import csv
import io
import json

router = APIRouter(prefix="/export", tags=["export"])

def generate_user_csv(user_id: int, session: Session) -> io.BytesIO:
    """Collect user data and write to CSV in memory.
    Includes votes, attended shows, lists, follows, and basic profile info.
    """
    output = io.StringIO()
    writer = csv.writer(output)
    # Header
    writer.writerow(["section", "field", "value"])
    # User profile
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    writer.writerow(["profile", "id", user.id])
    writer.writerow(["profile", "username", user.username])
    writer.writerow(["profile", "email", user.email])
    writer.writerow(["profile", "created_at", user.created_at.isoformat()])

    # Votes
    votes = session.exec(select(Vote).where(Vote.user_id == user_id)).all()
    for v in votes:
        target = "show" if v.show_id else "performance"
        target_id = v.show_id if v.show_id else v.performance_id
        writer.writerow(["vote", target, f"{target_id}:{v.rating}"])

    # Attended shows
    attended = session.exec(select(UserShowAttendance).where(UserShowAttendance.user_id == user_id)).all()
    for attendance in attended:
        writer.writerow(["attended_show", "show_id", attendance.show_id])
        writer.writerow(["attended_show", "attended_at", attendance.created_at.isoformat()])

    # Follows (users following this user)
    followers = session.exec(select(UserFollow).where(UserFollow.followed_id == user_id)).all()
    for follow in followers:
        follower = session.get(User, follow.follower_id)
        if follower:
            writer.writerow(["follower", "username", follower.username])

    # Follows (users this user is following)
    following = session.exec(select(UserFollow).where(UserFollow.follower_id == user_id)).all()
    for follow in following:
        followed = session.get(User, follow.followed_id)
        if followed:
            writer.writerow(["following", "username", followed.username])

    # Lists
    lists = session.exec(select(UserList).where(UserList.user_id == user_id)).all()
    for user_list in lists:
        writer.writerow(["list", "title", user_list.title])
        writer.writerow(["list", "description", user_list.description or ""])
        writer.writerow(["list", "items", user_list.items or "[]"])

    return io.BytesIO(output.getvalue().encode("utf-8"))

@router.get("/me/csv", response_class=StreamingResponse)
async def export_user_data(
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    """Export the authenticated user's data as a CSV file.
    The `user` dependency should be provided by authentication middleware.
    """
    csv_bytes = generate_user_csv(user.id, session)
    headers = {
        "Content-Disposition": f"attachment; filename=user_{user.id}_data.csv"
    }
    return StreamingResponse(csv_bytes, media_type="text/csv", headers=headers)


@router.get("/list/{list_id}", response_class=StreamingResponse)
async def export_list(
    list_id: int,
    token: str | None = Query(default=None),
    session: Session = Depends(get_session),
    current_user: User | None = Depends(get_current_user_optional),
):
    user_list = session.get(UserList, list_id)
    if not user_list:
        raise HTTPException(status_code=404, detail="List not found")

    is_owner = current_user and current_user.id == user_list.user_id
    token_ok = token and user_list.share_token and token == user_list.share_token

    if not (is_owner or token_ok or user_list.is_public):
        raise HTTPException(status_code=403, detail="Not authorized to export this list")

    items = []
    try:
        items = json.loads(user_list.items or "[]")
    except json.JSONDecodeError:
        items = []

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["list_id", "title", "list_type", "item_id"])
    for item_id in items:
        writer.writerow([user_list.id, user_list.title, user_list.list_type, item_id])

    headers = {
        "Content-Disposition": f"attachment; filename=list_{user_list.id}.csv"
    }
    return StreamingResponse(io.BytesIO(output.getvalue().encode("utf-8")), media_type="text/csv", headers=headers)
