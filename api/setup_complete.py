"""
Complete migration and seeding in one pass
"""
from sqlmodel import Session, select
from database import engine, create_db_and_tables
from models import User, Show, Song, SongPerformance, Vote
import json
import random
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

# Sample Goose songs
GOOSE_SONGS = [
    {"name": "Arcadia", "is_cover": False},
    {"name": "Hot Tea", "is_cover": False},
    {"name": "Arrow", "is_cover": False},
    {"name": "Rockdale", "is_cover": False},
    {"name": "Hungersite", "is_cover": False},
    {"name": "Factory Fiction", "is_cover": False},
    {"name": "Travelers", "is_cover": False},
    {"name": "Seekers on the Ridge", "is_cover": False},
    {"name": "All I Need", "is_cover": False},
    {"name": "Time to Flee", "is_cover": False},
    {"name": "Echo of a Rose", "is_cover": False},
    {"name": "Silver Rising", "is_cover": False},
    {"name": "Madhuvan", "is_cover": False},
   {"name": "Lead the Way", "is_cover": False},
    {"name": "Bob Don", "is_cover": False},
    {"name": "Creatures", "is_cover": False},
    {"name": "Yeti", "is_cover": False},
    {"name": "Tumble", "is_cover": False},
    {"name": "Butter Rum", "is_cover": False},
    {"name": "Empress of Organos", "is_cover": False},
    {"name": "Whipping Post", "is_cover": True, "original": "The Allman Brothers Band"},
    {"name": "Crosseyed and Painless", "is_cover": True, "original": "Talking Heads"},
    {"name": "Shakedown Street", "is_cover": True, "original": "Grateful Dead"},
]

SHOW_DATA = [
    (1001, "2022-12-16", "Fox Theatre", "Boulder, CO"),
    (1002, "2022-12-17", "Fox Theatre", "Boulder, CO"),
    (1003, "2022-12-18", "Fox Theatre", "Boulder, CO"),
    (1004, "2023-03-08", "The Capitol Theatre", "Port Chester, NY"),
    (1005, "2023-03-09", "The Capitol Theatre", "Port Chester, NY"),
    (1006, "2023-03-10", "The Capitol Theatre", "Port Chester, NY"),
    (1007, "2023-03-11", "The Capitol Theatre", "Port Chester, NY"),
    (1008, "2023-03-12", "The Capitol Theatre", "Port Chester, NY"),
    (1009, "2023-04-13", "The Sylvee", "Madison, WI"),
    (1010, "2023-04-14", "The Salt Shed", "Chicago, IL"),
    (1011, "2023-04-15", "The Salt Shed", "Chicago, IL"),
    (1012, "2023-06-21", "Electric Forest", "Rothbury, MI"),
    (1013, "2023-07-07", "SPAC", "Saratoga Springs, NY"),
    (1014, "2023-10-05", "Red Rocks", "Morrison, CO"),
    (1015, "2023-10-06", "Red Rocks", "Morrison, CO"),
]

def slugify(text):
    return text.lower().replace(" ", "-").replace("'", "")

def full_setup():
    print("=" * 60)
    print("COMPLETE DATABASE SETUP")
    print("=" * 60)
    
    # Create fresh database
    create_db_and_tables()
    
    with Session(engine) as session:
        # 1. Create Songs
        print("\n[1/5] Creating Songs...")
        songs = []
        for song_data in GOOSE_SONGS:
            song = Song(
                name=song_data["name"],
                artist="Goose",
                slug=slugify(song_data["name"]),
                is_cover=song_data["is_cover"],
                original_artist=song_data.get("original")
            )
            session.add(song)
            songs.append(song)
        session.commit()
        print(f"✓ Created {len(songs)} songs")
        
        # 2. Create Shows
        print("\n[2/5] Creating Shows...")
        shows = []
        for elgoose_id, date, venue, location in SHOW_DATA:
            show = Show(
                elgoose_id=elgoose_id,
                date=date,
                venue=venue,
                location=location,
                setlist_data=json.dumps({"Set 1": [], "Set 2": []})
            )
            session.add(show)
            shows.append(show)
        session.commit()
        print(f"✓ Created {len(shows)} shows")
        
        # 3. Create Performances
        print("\n[3/5] Creating Song Performances...")
        all_performances = []
        for show in shows:
            num_songs = random.randint(12, 20)
            selected_songs = random.sample(songs, min(num_songs, len(songs)))
            
            position = 1
            for i, song in enumerate(selected_songs):
                if i < num_songs * 0.6:
                    set_num = 1
                elif i < num_songs * 0.9:
                    set_num = 2
                else:
                    set_num = 3
                
                perf = SongPerformance(
                    song_id=song.id,
                    show_id=show.id,
                    position=position,
                    set_number=set_num
                )
                session.add(perf)
                all_performances.append(perf)
                position += 1
        session.commit()
        print(f"✓ Created {len(all_performances)} performances")
        
        # 4. Create Users
        print("\n[4/5] Creating Users...")
        personas = [
            {"prefix": "jam_lover", "count": 5, "min_rating": 7, "max_rating": 10, "vote_prob": 0.7},
            {"prefix": "song_fan", "count": 5, "min_rating": 6, "max_rating": 9, "vote_prob": 0.5},
            {"prefix": "critical", "count": 3, "min_rating": 3, "max_rating": 7, "vote_prob": 0.8},
            {"prefix": "newbie", "count": 4, "min_rating": 8, "max_rating": 10, "vote_prob": 0.3},
            {"prefix": "hater", "count": 2, "min_rating": 1, "max_rating": 5, "vote_prob": 0.4},
            {"prefix": "honky_king", "count": 1, "min_rating": 5, "max_rating": 10, "vote_prob": 0.9}
        ]
        
        all_users = []
        for p in personas:
            for i in range(p["count"]):
                username = f"{p['prefix']}_{i+1}" if p["count"] > 1 else p["prefix"]
                user = User(
                    username=username,
                    email=f"{username}@example.com",
                    hashed_password=get_password_hash("password")
                )
                session.add(user)
                all_users.append((user, p))
        session.commit()
        print(f"✓ Created {len(all_users)} users")
        
        # 5. Create Votes
        print("\n[5/5] Creating Votes...")
        vote_count = 0
        for user, persona in all_users:
            for performance in all_performances:
                if random.random() < persona["vote_prob"]:
                    rating = random.randint(persona["min_rating"], persona["max_rating"])
                    vote = Vote(
                        user_id=user.id,
                        performance_id=performance.id,
                        rating=rating
                    )
                    session.add(vote)
                    vote_count += 1
        session.commit()
        print(f"✓ Created {vote_count} votes")
    
    print("\n" + "=" * 60)
    print("DATABASE SETUP COMPLETE!")
    print(f"  • {len(songs)} songs")
    print(f"  • {len(shows)} shows")
    print(f"  • {len(all_performances)} performances")
    print(f"  • {len(all_users)} users")
    print(f"  • {vote_count} votes")
    print("=" * 60)

if __name__ == "__main__":
    full_setup()
