from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from database import get_session
from models import Tag, PerformanceTag, ShowTag, SongPerformance, Show, User
from routes.auth import get_current_user

router = APIRouter(prefix="/tags", tags=["tags"])

class TagUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None

class TaggedShow(BaseModel):
    id: int
    date: str
    venue: str
    location: str

class TaggedPerformance(BaseModel):
    id: int
    song_id: int
    song_name: str
    show_id: int
    show_date: str
    venue: str
    location: str

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

@router.put("/{tag_id}", response_model=Tag)
def update_tag(
    tag_id: int,
    tag_data: TagUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    tag = session.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    # Ensure unique name if changing
    if tag_data.name and tag_data.name != tag.name:
        existing = session.exec(select(Tag).where(Tag.name == tag_data.name)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Tag with that name already exists")

    if tag_data.name is not None:
        tag.name = tag_data.name
    if tag_data.category is not None:
        tag.category = tag_data.category
    if tag_data.color is not None:
        tag.color = tag_data.color
    if tag_data.description is not None:
        tag.description = tag_data.description

    session.add(tag)
    session.commit()
    session.refresh(tag)
    return tag

@router.get("/{tag_id}/shows", response_model=List[TaggedShow])
def get_tagged_shows(
    tag_id: int,
    session: Session = Depends(get_session)
):
    tag = session.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    shows = session.exec(
        select(Show)
        .join(ShowTag, ShowTag.show_id == Show.id)
        .where(ShowTag.tag_id == tag_id)
        .order_by(Show.date.desc())
    ).all()

    return [
        TaggedShow(
            id=show.id,
            date=show.date,
            venue=show.venue,
            location=show.location
        )
        for show in shows
    ]

@router.get("/{tag_id}/performances", response_model=List[TaggedPerformance])
def get_tagged_performances(
    tag_id: int,
    session: Session = Depends(get_session)
):
    tag = session.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    rows = session.exec(
        select(SongPerformance, Show)
        .join(PerformanceTag, PerformanceTag.performance_id == SongPerformance.id)
        .join(Show, Show.id == SongPerformance.show_id)
        .where(PerformanceTag.tag_id == tag_id)
        .order_by(Show.date.desc())
    ).all()

    performances: List[TaggedPerformance] = []
    for performance, show in rows:
        # performance.song is available via relationship when accessed
        song_name = performance.song.name if performance.song else "Unknown Song"
        performances.append(
            TaggedPerformance(
                id=performance.id,
                song_id=performance.song_id,
                song_name=song_name,
                show_id=show.id,
                show_date=show.date,
                venue=show.venue,
                location=show.location
            )
        )

    return performances

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
