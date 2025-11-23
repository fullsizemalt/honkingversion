from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

from database import get_session
from models import User, UserList, UserRead, Vote
from routes.auth import get_current_user, get_current_user_optional

router = APIRouter(prefix="/lists", tags=["lists"])

@router.post("/", response_model=UserList)
def create_list(
    user_list: UserList, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Override user_id to ensure it matches current user
    user_list.user_id = current_user.id
    user_list.created_at = datetime.utcnow()
    
    session.add(user_list)
    session.commit()
    session.refresh(user_list)
    return user_list

@router.get("/{list_id}", response_model=UserList)
def get_list(list_id: int, session: Session = Depends(get_session)):
    user_list = session.get(UserList, list_id)
    if not user_list:
        raise HTTPException(status_code=404, detail="List not found")
    return user_list

@router.put("/{list_id}", response_model=UserList)
def update_list(
    list_id: int,
    updated_list: UserList,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    user_list = session.get(UserList, list_id)
    if not user_list:
        raise HTTPException(status_code=404, detail="List not found")
        
    if user_list.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this list")
        
    user_list.title = updated_list.title
    user_list.description = updated_list.description
    user_list.items = updated_list.items
    user_list.list_type = updated_list.list_type
    
    session.add(user_list)
    session.commit()
    session.refresh(user_list)
    return user_list

@router.delete("/{list_id}")
def delete_list(
    list_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    user_list = session.get(UserList, list_id)
    if not user_list:
        raise HTTPException(status_code=404, detail="List not found")
        
    if user_list.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this list")
        
    session.delete(user_list)
    session.commit()
    return {"status": "success"}

@router.get("/user/{username}", response_model=List[UserList])
def get_user_lists(username: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    lists = session.exec(select(UserList).where(UserList.user_id == user.id)).all()
    return lists
