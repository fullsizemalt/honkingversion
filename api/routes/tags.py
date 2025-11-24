from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

from database import get_session
from models import Tag, PerformanceTag, ShowTag, SongPerformance, Show, User
from routes.auth import get_current_user

router = APIRouter(prefix="/tags", tags=["tags"])

@router.post("/", response_model=Tag)
def create_tag(
    tag: Tag, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    existing_tag = session.exec(select(Tag).where(Tag.name == tag.name)).first()
    if existing_tag:
        raise HTTPException(status_code=400, detail="Tag already exists")
    
    session.add(tag)
    session.commit()
    session.refresh(tag)
    return tag

@router.get("/", response_model=List[Tag])
def get_tags(
    category: Optional[str] = None,
    session: Session = Depends(get_session)
):
    query = select(Tag)
    if category:
        query = query.where(Tag.category == category)
    return session.exec(query).all()

@router.get("/performance/{performance_id}", response_model=List[Tag])
def get_performance_tags(
    performance_id: int,
    session: Session = Depends(get_session)
):
    performance = session.get(SongPerformance, performance_id)
    if not performance:
        raise HTTPException(status_code=404, detail="Performance not found")
    tags = session.exec(
        select(Tag)
        .join(PerformanceTag, PerformanceTag.tag_id == Tag.id)
        .where(PerformanceTag.performance_id == performance_id)
    ).all()
    return tags

@router.get("/show/{show_id}", response_model=List[Tag])
def get_show_tags(
    show_id: int,
    session: Session = Depends(get_session)
):
    show = session.get(Show, show_id)
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    tags = session.exec(
        select(Tag)
        .join(ShowTag, ShowTag.tag_id == Tag.id)
        .where(ShowTag.show_id == show_id)
    ).all()
    return tags

@router.post("/performance/{performance_id}", response_model=PerformanceTag)
def add_tag_to_performance(
    performance_id: int,
    tag_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    performance = session.get(SongPerformance, performance_id)
    if not performance:
        raise HTTPException(status_code=404, detail="Performance not found")
        
    tag = session.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
        
    existing = session.exec(
        select(PerformanceTag).where(
            PerformanceTag.performance_id == performance_id,
            PerformanceTag.tag_id == tag_id
        )
    ).first()
    
    if existing:
        return existing
        
    perf_tag = PerformanceTag(performance_id=performance_id, tag_id=tag_id)
    session.add(perf_tag)
    session.commit()
    session.refresh(perf_tag)
    return perf_tag

@router.delete("/performance/{performance_id}/{tag_id}")
def remove_tag_from_performance(
    performance_id: int,
    tag_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    existing = session.exec(
        select(PerformanceTag).where(
            PerformanceTag.performance_id == performance_id,
            PerformanceTag.tag_id == tag_id
        )
    ).first()
    
    if not existing:
        raise HTTPException(status_code=404, detail="Tag association not found")
        
    session.delete(existing)
    session.commit()
    return {"status": "success"}

@router.post("/show/{show_id}", response_model=ShowTag)
def add_tag_to_show(
    show_id: int,
    tag_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    show = session.get(Show, show_id)
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
        
    tag = session.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
        
    existing = session.exec(
        select(ShowTag).where(
            ShowTag.show_id == show_id,
            ShowTag.tag_id == tag_id
        )
    ).first()
    
    if existing:
        return existing
        
    show_tag = ShowTag(show_id=show_id, tag_id=tag_id)
    session.add(show_tag)
    session.commit()
    session.refresh(show_tag)
    return show_tag

@router.delete("/{tag_id}")
def delete_tag(
    tag_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    tag = session.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    # Remove associations first
    perf_tags = session.exec(select(PerformanceTag).where(PerformanceTag.tag_id == tag_id)).all()
    show_tags = session.exec(select(ShowTag).where(ShowTag.tag_id == tag_id)).all()
    for pt in perf_tags:
        session.delete(pt)
    for st in show_tags:
        session.delete(st)
    session.delete(tag)
    session.commit()
    return {"status": "deleted"}
