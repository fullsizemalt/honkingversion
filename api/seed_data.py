from sqlmodel import Session, select
from api.database import engine, create_db_and_tables
from api.models import User, Show, Vote, UserList
import random
import json
from datetime import datetime, timedelta
from passlib.context import CryptContext

# Use the same hashing scheme as auth.py
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def create_seed_data():
    create_db_and_tables()
    
    with Session(engine) as session:
        print("--- Starting Seed Data Generation ---")

        # --- Helper Functions ---
        def get_or_create_user(username, email, password="password"):
            user = session.exec(select(User).where(User.username == username)).first()
            hashed_pw = get_password_hash(password)
            if not user:
                user = User(username=username, email=email, hashed_password=hashed_pw)
                session.add(user)
                session.commit()
                session.refresh(user)
                print(f"Created User: {username}")
            else:
                # Update password to ensure it's hashed
                user.hashed_password = hashed_pw
                session.add(user)
                session.commit()
                print(f"Updated User: {username}")
            return user

        def get_or_create_show(elgoose_id, date, venue, location):
            show = session.exec(select(Show).where(Show.elgoose_id == elgoose_id)).first()
            if not show:
                show = Show(
                    elgoose_id=elgoose_id,
                    date=date,
                    venue=venue,
                    location=location,
                    setlist_data=json.dumps({"Set 1": ["Song A", "Song B"], "Set 2": ["Song C", "Song D"]}) # Dummy setlist
                )
                session.add(show)
                session.commit()
                session.refresh(show)
                # print(f"Created Show: {date} @ {venue}") # Reduce spam
            return show

        def create_vote(user, show, rating, comment=None):
            # Check if vote exists
            existing_vote = session.exec(select(Vote).where(Vote.user_id == user.id, Vote.show_id == show.id)).first()
            if not existing_vote:
                vote = Vote(user_id=user.id, show_id=show.id, rating=rating, comment=comment)
                session.add(vote)
                session.commit()

        def create_list(user, title, description, items):
            # Check if list exists (by title for simplicity)
            existing_list = session.exec(select(UserList).where(UserList.user_id == user.id, UserList.title == title)).first()
            if not existing_list:
                user_list = UserList(
                    user_id=user.id, 
                    title=title, 
                    description=description, 
                    items=json.dumps(items)
                )
                session.add(user_list)
                session.commit()
                print(f"Created List for {user.username}: {title}")

        # --- 1. Create Shows (Pool of ~15 shows) ---
        shows_data = [
            (1001, "2022-12-16", "Fox Theatre", "Boulder, CO"),
            (1002, "2022-12-17", "Fox Theatre", "Boulder, CO"), # Goosemas
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
        
        all_shows = []
        for s in shows_data:
            all_shows.append(get_or_create_show(*s))
        print(f"Ensured {len(all_shows)} shows exist.")

        # --- 2. Create Users & Activity ---

        # --- 2. Create Users & Activity ---
        
        personas = [
            {"prefix": "jam_fan", "count": 5, "min_rating": 7, "max_rating": 10, "vote_prob": 0.8, "comment_prob": 0.4, "comments": ["Killer jams!", "Type II madness.", "Ted Tapes vibes."]},
            {"prefix": "song_fan", "count": 5, "min_rating": 6, "max_rating": 9, "vote_prob": 0.6, "comment_prob": 0.3, "comments": ["Great setlist flow.", "Love this song.", "Solid playing."]},
            {"prefix": "critical", "count": 3, "min_rating": 3, "max_rating": 7, "vote_prob": 0.9, "comment_prob": 0.8, "comments": ["Mix was off.", "Sloppy transitions.", "Not their best."]},
            {"prefix": "newbie", "count": 4, "min_rating": 8, "max_rating": 10, "vote_prob": 0.3, "comment_prob": 0.2, "comments": ["My first show!", "Mind blown.", "So much fun."]},
            {"prefix": "hater", "count": 2, "min_rating": 1, "max_rating": 5, "vote_prob": 0.5, "comment_prob": 0.9, "comments": ["Overrated.", "Boring.", "Pass."]},
            {"prefix": "honky_king", "count": 1, "min_rating": 5, "max_rating": 10, "vote_prob": 1.0, "comment_prob": 0.5, "comments": ["Heater.", "Standard.", "Must listen."]} # Keep our main test user
        ]

        for p in personas:
            for i in range(p["count"]):
                username = f"{p['prefix']}_{i+1}" if p["count"] > 1 else p["prefix"]
                email = f"{username}@example.com"
                user = get_or_create_user(username, email)
                
                # Generate votes based on persona
                for show in all_shows:
                    if random.random() < p["vote_prob"]:
                        rating = random.randint(p["min_rating"], p["max_rating"])
                        comment = random.choice(p["comments"]) if random.random() < p["comment_prob"] else None
                        create_vote(user, show, rating, comment)
        
        # Create some lists for the main user
        honky_king = session.exec(select(User).where(User.username == "honky_king")).first()
        if honky_king:
             list1_shows = [s.id for s in all_shows[:5]]
             create_list(honky_king, "Best of 2022", "Top tier jams.", list1_shows)
             
             list2_shows = [s.id for s in all_shows[5:10]]
             create_list(honky_king, "Cap Run Highlights", "The residency was nuts.", list2_shows)

        print("--- Seed Data Generation Complete ---")

if __name__ == "__main__":
    create_seed_data()
