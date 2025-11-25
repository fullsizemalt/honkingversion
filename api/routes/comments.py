from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlmodel import Session, select, func

from api.database import get_session
from api.models import CommentVote, ReviewComment, User, Vote
from api.routes.auth import get_current_user
from api.services.notifications import create_notification

router = APIRouter(prefix="/comments", tags=["comments"])


class CommentCreate(BaseModel):
    vote_id: int
    body: str
    parent_id: Optional[int] = None


class CommentVoteRequest(BaseModel):
    is_upvote: bool = True


class CommentRead(BaseModel):
    id: int
    vote_id: int
    user_id: int
    username: str
    body: str
    upvotes: int
    parent_id: Optional[int]
    created_at: datetime
    replies: List["CommentRead"] = Field(default_factory=list)


@router.post("/", response_model=CommentRead)
def add_comment(
    payload: CommentCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    vote = session.get(Vote, payload.vote_id)
    if not vote:
        raise HTTPException(status_code=404, detail="Vote not found")

    parent_comment = None
    if payload.parent_id:
        parent_comment = session.get(ReviewComment, payload.parent_id)
        if not parent_comment or parent_comment.vote_id != payload.vote_id:
            raise HTTPException(status_code=400, detail="Invalid parent comment")

    comment = ReviewComment(
        vote_id=payload.vote_id,
        user_id=current_user.id,
        parent_id=payload.parent_id,
        body=payload.body,
        created_at=datetime.utcnow(),
    )
    session.add(comment)
    session.commit()
    session.refresh(comment)

    # Notify vote owner about a new comment
    if vote.user_id:
        create_notification(
            session,
            user_id=vote.user_id,
            actor_id=current_user.id,
            type="comment",
            object_type="vote",
            object_id=vote.id,
        )

    # Notify parent comment owner about a reply
    if parent_comment and parent_comment.user_id != vote.user_id:
        create_notification(
            session,
            user_id=parent_comment.user_id,
            actor_id=current_user.id,
            type="reply",
            object_type="comment",
            object_id=parent_comment.id,
        )

    return CommentRead(
        id=comment.id,
        vote_id=comment.vote_id,
        user_id=comment.user_id,
        username=current_user.username,
        body=comment.body,
        upvotes=comment.upvotes,
        parent_id=comment.parent_id,
        created_at=comment.created_at,
        replies=[],
    )


@router.get("/vote/{vote_id}", response_model=List[CommentRead])
def list_comments(
    vote_id: int,
    session: Session = Depends(get_session),
):
    comments_with_users = session.exec(
        select(ReviewComment, User)
        .join(User, User.id == ReviewComment.user_id)
        .where(ReviewComment.vote_id == vote_id)
        .order_by(ReviewComment.created_at.asc())
    ).all()

    node_map: dict[int, CommentRead] = {}
    for comment, user in comments_with_users:
        node_map[comment.id] = CommentRead(
            id=comment.id,
            vote_id=comment.vote_id,
            user_id=comment.user_id,
            username=user.username,
            body=comment.body,
            upvotes=comment.upvotes,
            parent_id=comment.parent_id,
            created_at=comment.created_at,
            replies=[],
        )

    roots: List[CommentRead] = []
    for comment_id, node in node_map.items():
        parent_id = node.parent_id
        if parent_id and parent_id in node_map:
            node_map[parent_id].replies.append(node)
        else:
            roots.append(node)

    return roots


@router.post("/{comment_id}/vote")
def vote_on_comment(
    comment_id: int,
    payload: CommentVoteRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    comment = session.get(ReviewComment, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    existing_vote = session.exec(
        select(CommentVote).where(
            CommentVote.comment_id == comment_id,
            CommentVote.user_id == current_user.id,
        )
    ).first()

    if existing_vote:
        existing_vote.is_upvote = payload.is_upvote
        session.add(existing_vote)
    else:
        session.add(
            CommentVote(
                comment_id=comment_id,
                user_id=current_user.id,
                is_upvote=payload.is_upvote,
                created_at=datetime.utcnow(),
            )
        )

    upvote_count = session.exec(
        select(func.count()).where(
            CommentVote.comment_id == comment_id,
            CommentVote.is_upvote == True,  # noqa: E712
        )
    ).one()

    comment.upvotes = upvote_count[0] if isinstance(upvote_count, tuple) else upvote_count
    session.add(comment)
    session.commit()
    session.refresh(comment)

    return {"comment_id": comment.id, "upvotes": comment.upvotes}
