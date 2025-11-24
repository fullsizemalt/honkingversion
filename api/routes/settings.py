from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel, EmailStr
from typing import Optional
import re

from database import get_session
from models import User, UserRead
from routes.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/settings", tags=["settings"])


# Request/Response Models
class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None


class EmailChangeRequest(BaseModel):
    new_email: EmailStr
    password: str


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str


class PrivacyPreferences(BaseModel):
    profile_visibility: str = "public"  # public, unlisted, private
    activity_visibility: str = "everyone"  # everyone, followers, private
    show_attendance_public: bool = True
    allow_follows: bool = True
    allow_messages: str = "everyone"  # everyone, followers, none
    show_stats: bool = True
    indexable: bool = True


# Utility functions
def validate_password(password: str) -> bool:
    """Check if password meets minimum requirements"""
    return len(password) >= 8


def validate_email(email: str) -> bool:
    """Basic email validation"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


# Profile Settings Endpoints
@router.get("/profile")
def get_profile_settings(current_user: User = Depends(get_current_user)):
    """Get current user's profile settings"""
    return {
        "display_name": current_user.display_name or "",
        "bio": current_user.bio or "",
        "profile_picture_url": current_user.profile_picture_url,
    }


@router.put("/profile")
def update_profile_settings(
    profile_update: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Update user's profile settings"""
    if profile_update.display_name is not None:
        if len(profile_update.display_name) > 50:
            raise HTTPException(status_code=400, detail="Display name must be 50 characters or less")
        current_user.display_name = profile_update.display_name

    if profile_update.bio is not None:
        if len(profile_update.bio) > 500:
            raise HTTPException(status_code=400, detail="Bio must be 500 characters or less")
        current_user.bio = profile_update.bio

    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return {
        "display_name": current_user.display_name or "",
        "bio": current_user.bio or "",
        "profile_picture_url": current_user.profile_picture_url,
    }


# Account Settings Endpoints
@router.get("/account")
def get_account_settings(current_user: User = Depends(get_current_user)):
    """Get current user's account settings"""
    return {
        "email": current_user.email,
        "username": current_user.username,
        "created_at": current_user.created_at,
    }


@router.put("/account/email")
def change_email(
    email_request: EmailChangeRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Change user's email address"""
    # Verify password
    if not current_user.verify_password(email_request.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    # Validate new email
    if not validate_email(email_request.new_email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    # Check if email is already in use
    existing_user = session.exec(
        select(User).where(User.email == email_request.new_email)
    ).first()

    if existing_user and existing_user.id != current_user.id:
        raise HTTPException(status_code=400, detail="Email already in use")

    current_user.email = email_request.new_email
    current_user.email_verified = False  # Require re-verification

    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return {
        "message": "Email updated successfully. Please check your inbox to verify your new email.",
        "email": current_user.email,
    }


@router.put("/account/password")
def change_password(
    password_request: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Change user's password"""
    # Verify current password
    if not current_user.verify_password(password_request.current_password):
        raise HTTPException(status_code=401, detail="Invalid current password")

    # Validate new password
    if not validate_password(password_request.new_password):
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long"
        )

    if password_request.new_password == password_request.current_password:
        raise HTTPException(
            status_code=400,
            detail="New password must be different from current password"
        )

    # Update password
    current_user.set_password(password_request.new_password)
    session.add(current_user)
    session.commit()

    return {"message": "Password changed successfully"}


# Privacy Settings Endpoints
@router.get("/privacy")
def get_privacy_settings(current_user: User = Depends(get_current_user)):
    """Get current user's privacy settings"""
    return {
        "profile_visibility": getattr(current_user, "profile_visibility", "public"),
        "activity_visibility": getattr(current_user, "activity_visibility", "everyone"),
        "show_attendance_public": getattr(current_user, "show_attendance_public", True),
        "allow_follows": getattr(current_user, "allow_follows", True),
        "allow_messages": getattr(current_user, "allow_messages", "everyone"),
        "show_stats": getattr(current_user, "show_stats", True),
        "indexable": getattr(current_user, "indexable", True),
    }


@router.put("/privacy")
def update_privacy_settings(
    privacy_prefs: PrivacyPreferences,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Update user's privacy settings"""
    # Validate visibility options
    valid_visibilities = ["public", "unlisted", "private"]
    if privacy_prefs.profile_visibility not in valid_visibilities:
        raise HTTPException(status_code=400, detail="Invalid profile visibility option")

    valid_activities = ["everyone", "followers", "private"]
    if privacy_prefs.activity_visibility not in valid_activities:
        raise HTTPException(status_code=400, detail="Invalid activity visibility option")

    valid_messages = ["everyone", "followers", "none"]
    if privacy_prefs.allow_messages not in valid_messages:
        raise HTTPException(status_code=400, detail="Invalid message permission option")

    # Update settings
    current_user.profile_visibility = privacy_prefs.profile_visibility
    current_user.activity_visibility = privacy_prefs.activity_visibility
    current_user.show_attendance_public = privacy_prefs.show_attendance_public
    current_user.allow_follows = privacy_prefs.allow_follows
    current_user.allow_messages = privacy_prefs.allow_messages
    current_user.show_stats = privacy_prefs.show_stats
    current_user.indexable = privacy_prefs.indexable

    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return {
        "message": "Privacy settings updated successfully",
        "settings": {
            "profile_visibility": current_user.profile_visibility,
            "activity_visibility": current_user.activity_visibility,
            "show_attendance_public": current_user.show_attendance_public,
            "allow_follows": current_user.allow_follows,
            "allow_messages": current_user.allow_messages,
            "show_stats": current_user.show_stats,
            "indexable": current_user.indexable,
        },
    }
