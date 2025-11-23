from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from database import get_session
from models import User, UserList

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=User)
def read_users_me(session: Session = Depends(get_session)):
    # Placeholder for actual user retrieval from token
    # In real app: current_user = get_current_user(token)
    # For now, just return the first user or empty
    statement = select(User)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="No users found")
    return user

@router.get("/{username}", response_model=User)
def read_user(username: str, session: Session = Depends(get_session)):
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/lists", response_model=UserList)
def create_list(user_list: UserList, session: Session = Depends(get_session)):
    session.add(user_list)
    session.commit()
    session.refresh(user_list)
    return user_list
