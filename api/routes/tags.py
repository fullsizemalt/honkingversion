from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, or_
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from database import get_session
from models import Tag, PerformanceTag, ShowTag, SongPerformance, Show, User, Song, SongTag
from routes.auth import get_current_user, get_current_user_optional

router = APIRouter(prefix="/tags", tags=["tags"])

class TagCreate(BaseModel):
    name: str
    category: Optional[str] = "general"
    color: Optional[str] = None
    description: Optional[str] = None
    is_private: bool = False

class TagUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    is_private: Optional[bool] = None

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

def _visibility_filter(current_user: Optional[User]):
    if current_user:
        return or_(Tag.is_private == False, Tag.owner_user_id == current_user.id)
    return Tag.is_private == False

@router.post("/", response_model=Tag)
def create_tag(
    tag: TagCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    existing_tag = session.exec(select(Tag).where(Tag.name == tag.name)).first()
    if existing_tag:
        raise HTTPException(status_code=400, detail="Tag already exists")

    new_tag = Tag(
        name=tag.name,
        category=tag.category or "general",
        color=tag.color,
        description=tag.description,
        is_private=tag.is_private,
        owner_user_id=current_user.id if tag.is_private else None,
        created_at=datetime.utcnow()
    )
    session.add(new_tag)
    session.commit()
    session.refresh(new_tag)
    return new_tag

@router.get("/", response_model=List[Tag])
def get_tags(
    category: Optional[str] = None,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    query = select(Tag).where(_visibility_filter(current_user))
    if category:
        query = query.where(Tag.category == category)
    return session.exec(query).all()

@router.get("/performance/{performance_id}", response_model=List[Tag])
def get_performance_tags(
    performance_id: int,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    performance = session.get(SongPerformance, performance_id)
    if not performance:
        raise HTTPException(status_code=404, detail="Performance not found")
    tags = session.exec(
        select(Tag)
        .join(PerformanceTag, PerformanceTag.tag_id == Tag.id)
        .where(PerformanceTag.performance_id == performance_id)
        .where(_visibility_filter(current_user))
    ).all()
    return tags

@router.get("/show/{show_id}", response_model=List[Tag])
def get_show_tags(
    show_id: int,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    show = session.get(Show, show_id)
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    tags = session.exec(
        select(Tag)
        .join(ShowTag, ShowTag.tag_id == Tag.id)
        .where(ShowTag.show_id == show_id)
        .where(_visibility_filter(current_user))
    ).all()
    return tags

@router.get("/song/{song_id}", response_model=List[Tag])
def get_song_tags(
    song_id: int,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    song = session.get(Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    tags = session.exec(
        select(Tag)
        .join(SongTag, SongTag.tag_id == Tag.id)
        .where(SongTag.song_id == song_id)
        .where(_visibility_filter(current_user))
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

    if tag.is_private and tag.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot use a private tag you do not own")
        
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

@router.post("/song/{song_id}", response_model=SongTag)
def add_tag_to_song(
    song_id: int,
    tag_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    song = session.get(Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")

    tag = session.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    if tag.is_private and tag.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot use a private tag you do not own")

    existing = session.exec(
        select(SongTag).where(
            SongTag.song_id == song_id,
            SongTag.tag_id == tag_id
        )
    ).first()

    if existing:
        return existing

    song_tag = SongTag(song_id=song_id, tag_id=tag_id)
    session.add(song_tag)
    session.commit()
    session.refresh(song_tag)
    return song_tag

@router.delete("/song/{song_id}/{tag_id}")
def remove_tag_from_song(
    song_id: int,
    tag_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    existing = session.exec(
        select(SongTag).where(
            SongTag.song_id == song_id,
            SongTag.tag_id == tag_id
        )
    ).first()

    if not existing:
        raise HTTPException(status_code=404, detail="Tag association not found")

    # Only owner can remove their private tag from song
    tag = session.get(Tag, tag_id)
    if tag and tag.is_private and tag.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot remove a private tag you do not own")

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
    if tag.owner_user_id and tag.owner_user_id != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="You cannot edit this tag")

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
    if tag_data.is_private is not None:
        # Only owner can change privacy
        if tag.owner_user_id and tag.owner_user_id != current_user.id:
            raise HTTPException(status_code=403, detail="You cannot change this tag")
        tag.is_private = tag_data.is_private
        tag.owner_user_id = current_user.id if tag_data.is_private else None

    session.add(tag)
    session.commit()
    session.refresh(tag)
    return tag

@router.get("/{tag_id}/shows", response_model=List[TaggedShow])
def get_tagged_shows(
    tag_id: int,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    tag = session.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    shows = session.exec(
        select(Show)
        .join(ShowTag, ShowTag.show_id == Show.id)
        .where(ShowTag.tag_id == tag_id)
        .where(_visibility_filter(current_user))
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
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    tag = session.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    rows = session.exec(
        select(SongPerformance, Show)
        .join(PerformanceTag, PerformanceTag.performance_id == SongPerformance.id)
        .join(Show, Show.id == SongPerformance.show_id)
        .where(PerformanceTag.tag_id == tag_id)
        .where(_visibility_filter(current_user))
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

    if tag.is_private and tag.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot use a private tag you do not own")
        
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
    if tag.is_private and tag.owner_user_id != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="You cannot delete this tag")
    # Remove associations first
    perf_tags = session.exec(select(PerformanceTag).where(PerformanceTag.tag_id == tag_id)).all()
    show_tags = session.exec(select(ShowTag).where(ShowTag.tag_id == tag_id)).all()
    song_tags = session.exec(select(SongTag).where(SongTag.tag_id == tag_id)).all()
    for pt in perf_tags:
        session.delete(pt)
    for st in show_tags:
        session.delete(st)
    for s in song_tags:
        session.delete(s)
    session.delete(tag)
    session.commit()
    return {"status": "deleted"}
