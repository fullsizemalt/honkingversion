"""
Database migration script: Migrate from show-based voting to performance-based voting.
This script:
1. Creates Song and SongPerformance tables
2. Populates with sample Goose songs
3. Creates performances for existing shows
4. Migrates existing votes to performances (best effort)
"""

from sqlmodel import Session, select
from database import engine, create_db_and_tables
from models import User, Show, Song, SongPerformance, Vote, UserList
import json
from datetime import datetime

# Sample Goose setlist data (common songs)
GOOSE_SONGS = [
    # Originals
    {"name": "Arcadia", "is_cover": False, "debut": "2016-01-01"},
    {"name": "Hot Tea", "is_cover": False, "debut": "2016-01-01"},
    {"name": "Arrow", "is_cover": False, "debut": "2016-01-01"},
    {"name": "Rockdale", "is_cover": False, "debut": "2016-01-01"},
    {"name": "Hungersite", "is_cover": False, "debut": "2016-01-01"},
    {"name": "Factory Fiction", "is_cover": False, "debut": "2016-01-01"},
    {"name": "Travelers", "is_cover": False, "debut": "2016-01-01"},
    {"name": "Seekers on the Ridge", "is_cover": False, "debut": "2016-01-01"},
    {"name": "All I Need", "is_cover": False, "debut": "2016-01-01"},
    {"name": "Time to Flee", "is_cover": False, "debut": "2016-01-01"},
    {"name": "Echo of a Rose", "is_cover": False, "debut": "2016-01-01"},
    {"name": "Silver Rising", "is_cover": False, "debut": "2016-01-01"},
    {"name": "Madhuvan", "is_cover": False, "debut": "2016-01-01"},
    {"name": "Lead the Way", "is_cover": False, "debut": "2016-01-01"},
    {"name": "Bob Don", "is_cover": False, "debut": "2016-01-01"},
    {"name": "Creatures", "is_cover": False, "debut": "2016-01-01"},
    {"name": "Yeti", "is_cover": False, "debut": "2016-01-01"},
    {"name": "Tumble", "is_cover": False, "debut": "2016-01-01"},
    {"name": "Butter Rum", "is_cover": False, "debut": "2016-01-01"},
   {"name": "Empress of Organos", "is_cover": False, "debut": "2021-01-01"},
    # Covers
    {"name": "Whipping Post", "is_cover": True, "original": "The Allman Brothers Band"},
    {"name": "Crosseyed and Painless", "is_cover": True, "original": "Talking Heads"},
    {"name": "Shakedown Street", "is_cover": True, "original": "Grateful Dead"},
]

def slugify(text):
    """Convert song name to URL-friendly slug"""
    return text.lower().replace(" ", "-").replace("'", "")

def create_songs(session):
    """Create Song records"""
    print("\n--- Creating Songs ---")
    for song_data in GOOSE_SONGS:
        slug = slugify(song_data["name"])
        existing = session.exec(select(Song).where(Song.slug == slug)).first()
        if not existing:
            song = Song(
                name=song_data["name"],
                artist="Goose",
                slug=slug,
                debut_date=song_data.get("debut"),
                is_cover=song_data["is_cover"],
                original_artist=song_data.get("original")
            )
            session.add(song)
            print(f"Created song: {song.name}")
    session.commit()

def create_performances_for_shows(session):
    """Create SongPerformance records for existing shows"""
    print("\n--- Creating Performances ---")
    
    shows = session.exec(select(Show)).all()
    songs = session.exec(select(Song)).all()
    
    # For now, create random performances for each show
    # In reality, you'd parse setlist_data or pull from El Goose API
    import random
    
    for show in shows:
        num_songs = random.randint(12, 20)  # Realistic show length
        selected_songs = random.sample(songs, min(num_songs, len(songs)))
        
        position = 1
        for i, song in enumerate(selected_songs):
            # Determine set (rough approximation)
            if i < num_songs * 0.6:
                set_num = 1
            elif i < num_songs * 0.9:
                set_num = 2
            else:
                set_num = 3  # Encore
           
            perf = SongPerformance(
                song_id=song.id,
                show_id=show.id,
                position=position,
                set_number=set_num
            )
            session.add(perf)
            position += 1
        
        print(f"Created {num_songs} performances for show {show.date}")
    
    session.commit()

def migrate_votes(session):
    """Migrate existing show votes to performance votes"""
    print("\n--- Migrating Votes ---")
    
    # Get all existing votes
    old_votes = session.exec(select(Vote).where(Vote.show_id != None, Vote.performance_id == None)).all()
    
    for vote in old_votes:
        # Find a random performance from this show to assign the vote to
        # In reality, users would need to re-vote on specific performances
        statement = select(SongPerformance).where(SongPerformance.show_id == vote.show_id)
        performances = session.exec(statement).all()
        
        if performances:
            import random
            selected_perf = random.choice(performances)
            vote.performance_id = selected_perf.id
            session.add(vote)
            print(f"Migrated vote {vote.id} to performance {selected_perf.id}")
    
    session.commit()
    print(f"Migrated {len(old_votes)} votes")

def run_migration():
    """Run the full migration"""
    print("=" * 50)
    print("Starting Migration to Performance-Based System")
    print("=" * 50)
    
    # Recreate tables (WARNING: This will drop existing data)
    # In production, use proper migrations like Alembic
    create_db_and_tables()
    
    with Session(engine) as session:
        create_songs(session)
        create_performances_for_shows(session)
        # Skip vote migration - will re-seed votes later
       # migrate_votes(session)
    
    print("\n" + "=" * 50)
    print("Migration Complete!")
    print("Songs and performances created. Run seed_data.py to generate votes.")
    print("=" * 50)

if __name__ == "__main__":
    run_migration()
