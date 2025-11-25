from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, func
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from ..database import get_session
from ..models import HonkingVersion, Song, SongPerformance, User
from ..routes.auth import get_current_user

router = APIRouter(prefix="/honking-versions", tags=["honking-versions"])

class HonkingVersionRead(BaseModel):
    id: int
    user_id: int
    song_id: int
    performance_id: int
    created_at: datetime
    updated_at: datetime

class HonkingVersionCreate(BaseModel):
    performance_id: int

@router.get("/song/{song_id}")
def get_honking_version_for_song(
    song_id: int,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Get the honking version for a song.
    Returns:
    - The performance with the most honking votes (the definitive version)
    - User's own honking vote for the song (if authenticated)
    - Vote counts for top performances
    """
    # Verify song exists
    song = session.get(Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")

    # Get all honking votes for this song with vote counts
    statement = select(
        HonkingVersion.performance_id,
        func.count(HonkingVersion.id).label("vote_count")
    ).where(HonkingVersion.song_id == song_id).group_by(HonkingVersion.performance_id).order_by(func.count(HonkingVersion.id).desc())

    results = session.exec(statement).all()

    # Build response
    response = {
        "song_id": song_id,
        "honking_version": None,
        "honking_votes": [],
        "user_honking_vote": None
    }

    # If there are votes, the top one is the honking version
    if results:
        top_performance_id, top_vote_count = results[0]
        top_perf = session.get(SongPerformance, top_performance_id)

        if top_perf:
            response["honking_version"] = {
                "id": top_perf.id,
                "performance_id": top_perf.id,
                "song_id": top_perf.song_id,
                "show_id": top_perf.show_id,
                "position": top_perf.position,
                "set_number": top_perf.set_number,
                "notes": top_perf.notes,
                "honking_votes": int(top_vote_count)
            }

        # Return all performances with honking votes
        for perf_id, vote_count in results:
            response["honking_votes"].append({
                "performance_id": perf_id,
                "vote_count": int(vote_count)
            })

    # Get current user's honking vote if authenticated
    if current_user:
        user_honking = session.exec(
            select(HonkingVersion).where(
                HonkingVersion.user_id == current_user.id,
                HonkingVersion.song_id == song_id
            )
        ).first()

        if user_honking:
            response["user_honking_vote"] = {
                "performance_id": user_honking.performance_id,
                "created_at": user_honking.created_at.isoformat(),
                "updated_at": user_honking.updated_at.isoformat()
            }

    return response

@router.post("/song/{song_id}")
def set_honking_version(
    song_id: int,
    data: HonkingVersionCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Set/update user's honking version vote for a song.
    User can only have ONE honking version per song.
    This endpoint creates or updates their vote.
    """
    # Verify song exists
    song = session.get(Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")

    # Verify performance exists and belongs to this song
    performance = session.get(SongPerformance, data.performance_id)
    if not performance:
        raise HTTPException(status_code=404, detail="Performance not found")
    if performance.song_id != song_id:
        raise HTTPException(status_code=400, detail="Performance does not belong to this song")

    # Check if user already has a honking version for this song
    existing_honking = session.exec(
        select(HonkingVersion).where(
            HonkingVersion.user_id == current_user.id,
            HonkingVersion.song_id == song_id
        )
    ).first()

    if existing_honking:
        # Update existing honking version
        existing_honking.performance_id = data.performance_id
        existing_honking.updated_at = datetime.utcnow()
        session.add(existing_honking)
    else:
        # Create new honking version
        honking = HonkingVersion(
            user_id=current_user.id,
            song_id=song_id,
            performance_id=data.performance_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        session.add(honking)

    session.commit()

    # Refresh to get updated data
    session.refresh(existing_honking if existing_honking else honking)
    honking_version = existing_honking if existing_honking else honking

    return {
        "id": honking_version.id,
        "user_id": honking_version.user_id,
        "song_id": honking_version.song_id,
        "performance_id": honking_version.performance_id,
        "created_at": honking_version.created_at.isoformat(),
        "updated_at": honking_version.updated_at.isoformat(),
        "message": "Honking version set successfully"
    }

@router.delete("/song/{song_id}")
def delete_honking_version(
    song_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Remove user's honking version vote for a song.
    """
    # Verify song exists
    song = session.get(Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")

    # Find and delete user's honking version
    honking = session.exec(
        select(HonkingVersion).where(
            HonkingVersion.user_id == current_user.id,
            HonkingVersion.song_id == song_id
        )
    ).first()

    if not honking:
        raise HTTPException(status_code=404, detail="No honking version found for this song")

    session.delete(honking)
    session.commit()

    return {"message": "Honking version removed successfully"}

@router.get("/performance/{performance_id}")
def get_honking_votes_for_performance(
    performance_id: int,
    session: Session = Depends(get_session)
):
    """
    Get honking vote count for a specific performance.
    Returns the number of users who voted this as their honking version.
    """
    # Verify performance exists
    performance = session.get(SongPerformance, performance_id)
    if not performance:
        raise HTTPException(status_code=404, detail="Performance not found")

    # Count honking votes
    vote_count = session.exec(
        select(func.count(HonkingVersion.id)).where(
            HonkingVersion.performance_id == performance_id
        )
    ).first() or 0

    return {
        "performance_id": performance_id,
        "song_id": performance.song_id,
        "honking_vote_count": int(vote_count)
    }

@router.get("/user/{user_id}/songs")
def get_user_honking_versions(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    session: Session = Depends(get_session)
):
    """
    Get all honking version votes for a specific user.
    Shows which songs the user has voted as their honking version.
    """
    # Get user's honking version votes
    statement = select(HonkingVersion).where(
        HonkingVersion.user_id == user_id
    ).offset(skip).limit(limit)

    honking_versions = session.exec(statement).all()

    return {
        "user_id": user_id,
        "honking_versions": [
            {
                "id": hv.id,
                "song_id": hv.song_id,
                "performance_id": hv.performance_id,
                "created_at": hv.created_at.isoformat(),
                "updated_at": hv.updated_at.isoformat()
            }
            for hv in honking_versions
        ],
        "total": len(honking_versions)
    }
