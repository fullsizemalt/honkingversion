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
    attended_shows: List["UserShowAttendance"] = Relationship(back_populates="user")

class Show(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    elgoose_id: int = Field(unique=True, index=True)
    date: str = Field(index=True) # YYYY-MM-DD
    venue: str
    location: str
    setlist_data: str # JSON string
    
    votes: List["Vote"] = Relationship(back_populates="show")
    performances: List["SongPerformance"] = Relationship(back_populates="show")
    show_tags: List["ShowTag"] = Relationship(back_populates="show")
    attended_users: List["UserShowAttendance"] = Relationship(back_populates="show")

class UserShowAttendance(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    show_id: int = Field(foreign_key="show.id", primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    user: "User" = Relationship(back_populates="attended_shows")
    show: "Show" = Relationship(back_populates="attended_users")

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
    song_id: int = Field(foreign_key="song.id")
    show_id: int = Field(foreign_key="show.id")
    position: Optional[int] = None
    set_number: Optional[int] = None
    notes: Optional[str] = None
    
    song: Song = Relationship(back_populates="performances")
    show: Show = Relationship(back_populates="performances")
    votes: List["Vote"] = Relationship(back_populates="performance")
    performance_tags: List["PerformanceTag"] = Relationship(back_populates="performance")

class UserFollow(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    follower_id: int = Field(foreign_key="user.id", index=True)
    followed_id: int = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Vote(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    show_id: Optional[int] = Field(default=None, foreign_key="show.id")
    performance_id: Optional[int] = Field(default=None, foreign_key="songperformance.id")
    rating: int # 1-10
    comment: Optional[str] = None # Legacy, can be used as blurb or migrated
    blurb: Optional[str] = None # Concise review
    full_review: Optional[str] = None # Detailed review
    is_featured: bool = Field(default=False) # User can feature up to 5 songs and 5 shows
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    user: User = Relationship(back_populates="votes")
    show: Optional["Show"] = Relationship(back_populates="votes")
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

class Tag(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    category: str  # "jam_type", "venue_type", "special"
    color: Optional[str] = None  # Hex color for UI display
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    performance_tags: List["PerformanceTag"] = Relationship(back_populates="tag")
    show_tags: List["ShowTag"] = Relationship(back_populates="tag")

class PerformanceTag(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    performance_id: int = Field(foreign_key="songperformance.id", index=True)
    tag_id: int = Field(foreign_key="tag.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    performance: SongPerformance = Relationship(back_populates="performance_tags")
    tag: Tag = Relationship(back_populates="performance_tags")

class ShowTag(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    show_id: int = Field(foreign_key="show.id", index=True)
    tag_id: int = Field(foreign_key="tag.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    show: Show = Relationship(back_populates="show_tags")
    tag: Tag = Relationship(back_populates="show_tags")

class UserStats(SQLModel):
    shows_attended: int = 0
    reviews_count: int = 0
    followers_count: int = 0
    following_count: int = 0

class UserRead(SQLModel):
    id: int
    username: str
    email: str
    created_at: datetime
    stats: Optional[UserStats] = None
    is_following: bool = False
