from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    votes: List["Vote"] = Relationship(back_populates="user")
    lists: List["UserList"] = Relationship(back_populates="user")

class Show(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    elgoose_id: int = Field(unique=True, index=True)
    date: str = Field(index=True) # YYYY-MM-DD
    venue: str
    location: str
    setlist_data: str # JSON string
    
    votes: List["Vote"] = Relationship(back_populates="show")
    performances: List["SongPerformance"] = Relationship(back_populates="show")

class Song(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    artist: str = Field(default="Goose", index=True)  # For multi-band support
    slug: str = Field(unique=True, index=True)  # URL-friendly name
    debut_date: Optional[str] = None  # First known performance
    times_played: int = Field(default=0)  # Denormalized count
    avg_rating: Optional[float] = None  # Denormalized average
    is_cover: bool = Field(default=False)
    original_artist: Optional[str] = None  # If cover
    
    performances: List["SongPerformance"] = Relationship(back_populates="song")

class SongPerformance(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    song_id: int = Field(foreign_key="song.id", index=True)
    show_id: int = Field(foreign_key="show.id", index=True)
    position: int  # Order in setlist (1, 2, 3...)
    set_number: int = Field(default=1)  # Which set (1, 2, 3 for encore)
    notes: Optional[str] = None  # "Guest: Trey Anastasio", "Unfinished", "Segue"
    transition_from_id: Optional[int] = Field(default=None, foreign_key="songperformance.id")
    duration_seconds: Optional[int] = None
    
    song: Song = Relationship(back_populates="performances")
    show: Show = Relationship(back_populates="performances")
    votes: List["Vote"] = Relationship(back_populates="performance")

class Vote(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    show_id: Optional[int] = Field(default=None, foreign_key="show.id")  # Legacy support
    performance_id: Optional[int] = Field(default=None, foreign_key="songperformance.id")  # New
    rating: int # 1-10
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    user: User = Relationship(back_populates="votes")
    show: Optional[Show] = Relationship(back_populates="votes")
    performance: Optional[SongPerformance] = Relationship(back_populates="votes")

class UserList(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    title: str
    description: Optional[str] = None
    items: str # JSON string of list items (performance_ids or show_ids for now)
    list_type: str = Field(default="performances")  # "performances" or "shows" for backward compat
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    user: User = Relationship(back_populates="lists")
