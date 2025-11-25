from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from enum import Enum
import re

class ProfileVisibility(str, Enum):
    PUBLIC = "public"
    UNLISTED = "unlisted"
    PRIVATE = "private"

class ActivityVisibility(str, Enum):
    EVERYONE = "everyone"
    FOLLOWERS = "followers"
    PRIVATE = "private"

class MessagePermission(str, Enum):
    EVERYONE = "everyone"
    FOLLOWERS = "followers"
    NONE = "none"

class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None

    @field_validator('display_name')
    def display_name_length(cls, v):
        if v and len(v) > 50:
            raise ValueError('Display name must be 50 characters or less')
        return v

    @field_validator('bio')
    def bio_length(cls, v):
        if v and len(v) > 500:
            raise ValueError('Bio must be 500 characters or less')
        return v

class EmailChangeRequest(BaseModel):
    new_email: EmailStr
    password: str

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

    @field_validator('new_password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class PrivacyPreferences(BaseModel):
    profile_visibility: ProfileVisibility = ProfileVisibility.PUBLIC
    activity_visibility: ActivityVisibility = ActivityVisibility.EVERYONE
    show_attendance_public: bool = True
    allow_follows: bool = True
    allow_messages: MessagePermission = MessagePermission.EVERYONE
    show_stats: bool = True
    indexable: bool = True