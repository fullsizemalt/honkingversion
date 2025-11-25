from typing import Optional, List
from enum import Enum
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, UniqueConstraint

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Profile fields
    display_name: Optional[str] = None
    bio: Optional[str] = Field(default=None, max_length=160)
    profile_picture_url: Optional[str] = None
    selected_title_id: Optional[int] = Field(default=None, foreign_key="usertitle.id")
    role: str = Field(default="user")  # user, power_user, mod, admin, superadmin
    
    # Social links (stored as JSON string)
    social_links: Optional[str] = None  # JSON: {"twitter": "...", "instagram": "...", "custom_url": "..."}
    
    # Privacy settings
    profile_visibility: str = Field(default="public")
    activity_visibility: str = Field(default="everyone")
    show_attendance_public: bool = Field(default=True)
    allow_follows: bool = Field(default=True)
    allow_messages: str = Field(default="everyone")
    show_stats: bool = Field(default=True)
    indexable: bool = Field(default=True)

    votes: List["Vote"] = Relationship(back_populates="user")
    honking_versions: List["HonkingVersion"] = Relationship(back_populates="user")
    lists: List["UserList"] = Relationship(back_populates="user")
    attended_shows: List["UserShowAttendance"] = Relationship(back_populates="user")
    notifications: List["Notification"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"foreign_keys": "Notification.user_id"}
    )
    review_comments: List["ReviewComment"] = Relationship(back_populates="user")
    earned_titles: List["UserTitle"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"foreign_keys": "UserTitle.user_id"},
    )
    earned_badges: List["UserBadge"] = Relationship(back_populates="user")
    followed_lists: List["ListFollow"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"foreign_keys": "ListFollow.user_id"}
    )

class Show(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    elgoose_id: int = Field(unique=True, index=True)
    date: str = Field(index=True) # YYYY-MM-DD
    venue: str
    location: str
    tour: Optional[str] = Field(default=None, index=True)
    setlist_data: str # JSON string

    # External links
    bandcamp_url: Optional[str] = None
    nugs_url: Optional[str] = None

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

    # Honking version denormalized cache
    current_honking_performance_id: Optional[int] = Field(default=None, foreign_key="songperformance.id")
    current_honking_vote_count: int = Field(default=0)
    honking_version_updated_at: Optional[datetime] = None

    performances: List["SongPerformance"] = Relationship(
        back_populates="song",
        sa_relationship_kwargs={
            "foreign_keys": "SongPerformance.song_id"
        }
    )
    honking_versions: List["HonkingVersion"] = Relationship(back_populates="song")
    tags: List["SongTag"] = Relationship(back_populates="song")
    current_honking_performance: Optional["SongPerformance"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "Song.current_honking_performance_id",
            "viewonly": True
        }
    )

class SongPerformance(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    song_id: int = Field(foreign_key="song.id")
    show_id: int = Field(foreign_key="show.id")
    position: Optional[int] = None
    set_number: Optional[int] = None
    notes: Optional[str] = None

    # Honking vote count denormalized cache
    honking_vote_count: int = Field(default=0, index=True)
    honking_votes_updated_at: Optional[datetime] = None

    # External links
    bandcamp_url: Optional[str] = None
    nugs_url: Optional[str] = None

    song: Song = Relationship(
        back_populates="performances",
        sa_relationship_kwargs={
            "foreign_keys": "SongPerformance.song_id"
        }
    )
    show: Show = Relationship(back_populates="performances")
    votes: List["Vote"] = Relationship(back_populates="performance")
    honking_votes: List["HonkingVersion"] = Relationship(back_populates="performance")
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
    comments: List["ReviewComment"] = Relationship(back_populates="vote")

class HonkingVersion(SQLModel, table=True):
    """
    User's vote for the definitive/best version of a song.
    Each user gets exactly ONE honking version vote per song.
    The performance with the most honking votes is "THE" honking version.
    Users can change their vote anytime, but only have one vote per song.
    This is NOT a rating (1-10), just a vote for which performance best exemplifies the song.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    song_id: int = Field(foreign_key="song.id", index=True)
    performance_id: int = Field(foreign_key="songperformance.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user: User = Relationship(back_populates="honking_versions")
    song: Song = Relationship(back_populates="honking_versions")
    performance: SongPerformance = Relationship(back_populates="honking_votes")

    __table_args__ = (
        UniqueConstraint("user_id", "song_id", name="unique_user_song_honk"),
    )

class UserList(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    title: str
    description: Optional[str] = None
    items: str # JSON string of list items (performance_ids or show_ids for now)
    list_type: str = Field(default="performances")  # "performances" or "shows" for backward compat
    share_token: Optional[str] = Field(default=None, index=True, unique=True)
    is_public: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    user: User = Relationship(back_populates="lists")
    followers: List["ListFollow"] = Relationship(back_populates="list")

class ListFollow(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    list_id: int = Field(foreign_key="userlist.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    user: User = Relationship(
        back_populates="followed_lists",
        sa_relationship_kwargs={"foreign_keys": "ListFollow.user_id"}
    )
    list: UserList = Relationship(back_populates="followers")

class UserTitle(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    title_name: str  # e.g., "Early Adopter", "Top Contributor"
    title_description: Optional[str] = None
    color: str = Field(default="#ff6b35")  # Accent color for display
    icon: Optional[str] = None  # Emoji or icon identifier
    earned_at: datetime = Field(default_factory=datetime.utcnow)
    
    user: User = Relationship(
        back_populates="earned_titles",
        sa_relationship_kwargs={"foreign_keys": "UserTitle.user_id"},
    )

class UserBadge(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    badge_name: str  # e.g., "100 Shows", "Early Adopter"
    badge_description: Optional[str] = None
    badge_icon: str  # Emoji or icon identifier
    unlock_criteria: Optional[str] = None  # How to unlock this badge
    earned_at: datetime = Field(default_factory=datetime.utcnow)
    
    user: User = Relationship(back_populates="earned_badges")

class Tag(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    category: str = Field(default="general")  # "jam_type", "venue_type", "special", "general"
    color: Optional[str] = None  # Hex color for UI display
    description: Optional[str] = None
    is_private: bool = Field(default=False)
    owner_user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    performance_tags: List["PerformanceTag"] = Relationship(back_populates="tag")
    show_tags: List["ShowTag"] = Relationship(back_populates="tag")
    song_tags: List["SongTag"] = Relationship(back_populates="tag")

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

class SongTag(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    song_id: int = Field(foreign_key="song.id", index=True)
    tag_id: int = Field(foreign_key="tag.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    song: Song = Relationship(back_populates="tags")
    tag: Tag = Relationship(back_populates="song_tags")

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

class ReviewComment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    vote_id: int = Field(foreign_key="vote.id", index=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    parent_id: Optional[int] = Field(default=None, foreign_key="reviewcomment.id", index=True)
    body: str
    upvotes: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: User = Relationship(back_populates="review_comments")
    vote: Vote = Relationship(back_populates="comments")
    parent: Optional["ReviewComment"] = Relationship(
        back_populates="replies",
        sa_relationship_kwargs={"remote_side": "ReviewComment.id"}
    )
    replies: List["ReviewComment"] = Relationship(back_populates="parent")
    votes: List["CommentVote"] = Relationship(back_populates="comment")

class CommentVote(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    comment_id: int = Field(foreign_key="reviewcomment.id", index=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    is_upvote: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    comment: ReviewComment = Relationship(back_populates="votes")

class Notification(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)  # recipient
    type: str = Field(index=True)  # e.g. comment, reply, follow
    actor_id: Optional[int] = Field(default=None, foreign_key="user.id")
    object_type: str  # vote, comment, user
    object_id: int
    read_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: User = Relationship(
        back_populates="notifications",
        sa_relationship_kwargs={"foreign_keys": "Notification.user_id"}
    )
    actor: Optional[User] = Relationship(
        sa_relationship_kwargs={"foreign_keys": "Notification.actor_id"}
    )

class Feedback(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    type: str = Field(default="bug") # bug, feature, other
    subject: str
    message: str
    status: str = Field(default="open") # open, closed, in_progress
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship()

class ChangelogEntry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    date: datetime = Field(default_factory=datetime.utcnow)
    type: str = Field(default="fix") # fix, feature, improvement
    credited_user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    
    credited_user: Optional[User] = Relationship()

class ObjectType(str, Enum):
    SONG = "song"
    SHOW = "show"
    VENUE = "venue"
    TOUR = "tour"

class Synopsis(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    object_type: str = Field(index=True) # song, show, venue, tour
    object_id: int = Field(index=True) # ID of the Song, Show, etc.
    content: str # Markdown content
    last_updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_updated_by_id: int = Field(foreign_key="user.id")
    
    # Optimistic locking
    version: int = Field(default=1)

    last_updated_by: User = Relationship()

class SynopsisHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    synopsis_id: int = Field(foreign_key="synopsis.id", index=True)
    content: str
    edited_by_id: int = Field(foreign_key="user.id")
    edited_at: datetime = Field(default_factory=datetime.utcnow)
    change_summary: Optional[str] = None # "Fixed typo", "Added context"
    version: int # Snapshot of the version number at this time

    synopsis: Synopsis = Relationship()
    edited_by: User = Relationship()

class AnalyticsEvent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    event_type: str = Field(index=True) # page_view, click, vote, etc.
    path: str = Field(index=True)
    metadata_json: Optional[str] = None # JSON string for extra data
    session_id: str = Field(index=True) # Anonymous session ID
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)

    user: Optional[User] = Relationship()

SQLModel.update_forward_refs()
