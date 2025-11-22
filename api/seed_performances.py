from sqlmodel import Session, select
from database import engine
from models import User, Show, Song, SongPerformance, Vote
import random
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def create_seed_data():
    with Session(engine) as session:
        print("--- Starting Performance Seed Data Generation ---")
        
        # Create diverse user personas
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
                email = f"{username}@example.com"
                
                # Check if user exists
                user = session.exec(select(User).where(User.username == username)).first()
                if not user:
                    user = User(
                        username=username,
                        email=email,
                        hashed_password=get_password_hash("password")
                    )
                    session.add(user)
                    session.commit()
                    session.refresh(user)
                    print(f"Created user: {username}")
                
                all_users.append((user, p))
        
        # Get all performances
        all_performances = session.exec(select(SongPerformance)).all()
        print(f"Found {len(all_performances)} performances")
        
        # Generate votes based on personas
        vote_count = 0
        for user, persona in all_users:
            for performance in all_performances:
                if random.random() < persona["vote_prob"]:
                    # Check if vote already exists
                    existing = session.exec(
                        select(Vote).where(
                            Vote.user_id == user.id,
                            Vote.performance_id == performance.id
                        )
                    ).first()
                    
                    if not existing:
                        rating = random.randint(persona["min_rating"], persona["max_rating"])
                        vote = Vote(
                            user_id=user.id,
                            performance_id=performance.id,
                            rating=rating
                        )
                        session.add(vote)
                        vote_count += 1
        
        session.commit()
        print(f"Created {vote_count} performance votes")
        print("--- Seed Data Generation Complete ---")

if __name__ == "__main__":
    create_seed_data()
