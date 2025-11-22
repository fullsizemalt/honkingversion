from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from pydantic import BaseModel
import json

from ..database import get_session
from ..models import User, UserList, Show
from .auth import get_current_user

router = APIRouter(prefix="/lists", tags=["lists"])

class ListCreate(BaseModel):
    title: str
    description: Optional[str] = None
    show_ids: List[int] = []

class ListUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    show_ids: Optional[List[int]] = None

class ListRead(BaseModel):
    id: int
    user_id: int
    username: str
    title: str
    description: Optional[str]
    show_count: int
    created_at: Optional[str] = None

class ListDetail(BaseModel):
    id: int
    user_id: int
    username: str
    title: str
    description: Optional[str]
    shows: List[dict]
    created_at: Optional[str] = None

@router.get("/", response_model=List[ListRead])
def get_all_lists(
    skip: int = 0,
    limit: int = 20,
    session: Session = Depends(get_session)
):
    statement = select(UserList, User).join(User).offset(skip).limit(limit)
    results = session.exec(statement).all()
    
    lists_read = []
    for user_list, user in results:
        show_ids = json.loads(user_list.items) if user_list.items else []
        lists_read.append(ListRead(
            id=user_list.id,
            user_id=user_list.user_id,
            username=user.username,
            title=user_list.title,
            description=user_list.description,
            show_count=len(show_ids),
            created_at=str(user_list.created_at) if user_list.created_at else None
        ))
    
    return lists_read

@router.get("/user/{user_id}", response_model=List[ListRead])
def get_user_lists(
    user_id: int,
    session: Session = Depends(get_session)
):
    statement = select(UserList, User).join(User).where(UserList.user_id == user_id)
    results = session.exec(statement).all()
    
    lists_read = []
    for user_list, user in results:
        show_ids = json.loads(user_list.items) if user_list.items else []
        lists_read.append(ListRead(
            id=user_list.id,
            user_id=user_list.user_id,
            username=user.username,
            title=user_list.title,
            description=user_list.description,
            show_count=len(show_ids),
            created_at=str(user_list.created_at) if user_list.created_at else None
        ))
    
    return lists_read

@router.get("/{list_id}", response_model=ListDetail)
def get_list(
    list_id: int,
    session: Session = Depends(get_session)
):
    statement = select(UserList, User).join(User).where(UserList.id == list_id)
    result = session.exec(statement).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="List not found")
    
    user_list, user = result
    show_ids = json.loads(user_list.items) if user_list.items else []
    
    # Fetch shows
    shows = []
    if show_ids:
        statement = select(Show).where(Show.id.in_(show_ids))
        shows_result = session.exec(statement).all()
        shows = [{"id": s.id, "date": s.date, "venue": s.venue, "location": s.location} for s in shows_result]
    
    return ListDetail(
        id=user_list.id,
        user_id=user_list.user_id,
        username=user.username,
        title=user_list.title,
        description=user_list.description,
        shows=shows,
        created_at=str(user_list.created_at) if user_list.created_at else None
    )

@router.post("/", response_model=ListRead)
def create_list(
    list_in: ListCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    user_list = UserList(
        user_id=current_user.id,
        title=list_in.title,
        description=list_in.description,
        items=json.dumps(list_in.show_ids)
    )
    session.add(user_list)
    session.commit()
    session.refresh(user_list)
    
    return ListRead(
        id=user_list.id,
        user_id=user_list.user_id,
        username=current_user.username,
        title=user_list.title,
        description=user_list.description,
        show_count=len(list_in.show_ids),
        created_at=str(user_list.created_at) if user_list.created_at else None
    )

@router.put("/{list_id}", response_model=ListRead)
def update_list(
    list_id: int,
    list_update: ListUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    user_list = session.get(UserList, list_id)
    if not user_list:
        raise HTTPException(status_code=404, detail="List not found")
    
    if user_list.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this list")
    
    if list_update.title is not None:
        user_list.title = list_update.title
    if list_update.description is not None:
        user_list.description = list_update.description
    if list_update.show_ids is not None:
        user_list.items = json.dumps(list_update.show_ids)
    
    session.add(user_list)
    session.commit()
    session.refresh(user_list)
    
    show_ids = json.loads(user_list.items) if user_list.items else []
    
    return ListRead(
        id=user_list.id,
        user_id=user_list.user_id,
        username=current_user.username,
        title=user_list.title,
        description=user_list.description,
        show_count=len(show_ids),
        created_at=str(user_list.created_at) if user_list.created_at else None
    )

@router.delete("/{list_id}")
def delete_list(
    list_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    user_list = session.get(UserList, list_id)
    if not user_list:
        raise HTTPException(status_code=404, detail="List not found")
    
    if user_list.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this list")
    
    session.delete(user_list)
    session.commit()
    
    return {"message": "List deleted successfully"}
