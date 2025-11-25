import secrets
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

from api.database import get_session
from api.models import User, UserList, UserRead, Vote
from api.routes.auth import get_current_user, get_current_user_optional

router = APIRouter(prefix="/lists", tags=["lists"])

@router.get("/", response_model=List[dict])
def list_lists(session: Session = Depends(get_session)):
    rows = session.exec(select(UserList, User).join(User, User.id == UserList.user_id)).all()
    results = []
    for user_list, user in rows:
        data = user_list.model_dump()
        data["share_token"] = None
        data["username"] = user.username
        results.append(data)
    return results

@router.post("/", response_model=UserList)
def create_list(
    user_list: UserList, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Override user_id to ensure it matches current user
    user_list.user_id = current_user.id
    if user_list.is_public is None:
        user_list.is_public = True
    user_list.created_at = datetime.utcnow()
    
    session.add(user_list)
    session.commit()
    session.refresh(user_list)
    return user_list

@router.get("/{list_id}", response_model=UserList)
def get_list(
    list_id: int,
    token: Optional[str] = Query(default=None),
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    user_list = session.get(UserList, list_id)
    if not user_list:
        raise HTTPException(status_code=404, detail="List not found")

    is_owner = current_user and user_list.user_id == current_user.id
    token_ok = token and user_list.share_token and token == user_list.share_token

    if not (is_owner or token_ok or user_list.is_public):
        raise HTTPException(status_code=403, detail="Not authorized to view this list")

    list_dict = user_list.model_dump()
    if not is_owner:
        list_dict["share_token"] = None
    return list_dict

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

@router.post("/{list_id}/share")
def share_list(
    list_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    user_list = session.get(UserList, list_id)
    if not user_list:
        raise HTTPException(status_code=404, detail="List not found")
    if user_list.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to share this list")

    user_list.share_token = secrets.token_urlsafe(12)
    user_list.is_public = True
    session.add(user_list)
    session.commit()
    session.refresh(user_list)

    return {"share_token": user_list.share_token}

@router.post("/{list_id}/unshare")
def unshare_list(
    list_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    user_list = session.get(UserList, list_id)
    if not user_list:
        raise HTTPException(status_code=404, detail="List not found")
    if user_list.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to unshare this list")

    user_list.share_token = None
    user_list.is_public = False
    session.add(user_list)
    session.commit()
    session.refresh(user_list)
    return {"message": "List unshared"}

@router.get("/shared/{token}")
def get_shared_list(
    token: str,
    session: Session = Depends(get_session),
):
    statement = select(UserList).where(UserList.share_token == token)
    user_list = session.exec(statement).first()
    if not user_list:
        raise HTTPException(status_code=404, detail="Shared list not found")
    list_dict = user_list.model_dump()
    list_dict["share_token"] = None
    return list_dict
