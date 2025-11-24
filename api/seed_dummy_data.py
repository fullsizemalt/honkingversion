
import logging
import random
from datetime import datetime, timedelta
from pathlib import Path
from sqlmodel import Session, SQLModel, create_engine, select
from models import Show, Song, SongPerformance, Vote, User, ReviewComment

# Setup DB
DB_PATH = Path(__file__).parent / "database.db"
engine = create_engine(f"sqlite:///{DB_PATH}", echo=False)

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

def main():
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # 1. Create Users
        usernames = ["HonkLover", "GooseFan1", "JiveLee", "ArcadiaGoose", "FactoryFiction", "MadhuvanMan", "TumbleWeed", "YetiSpaghetti"]
        users = []
        for username in usernames:
            user = session.exec(select(User).where(User.username == username)).first()
            if not user:
                user = User(
                    username=username,
                    email=f"{username.lower()}@example.com",
                    hashed_password="dummy"
                )
                session.add(user)
                session.commit()
                session.refresh(user)
                log.info(f"Created user: {user.username}")
            users.append(user)

        # 2. Create Songs (if not exist)
        song_names = ["Arcadia", "Madhuvan", "Factory Fiction", "Tumble", "Yeti", "Creatures", "Hot Tea", "Empress of Organos"]
        songs = []
        for name in song_names:
            slug = name.lower().replace(" ", "-")
            song = session.exec(select(Song).where(Song.slug == slug)).first()
            if not song:
                song = Song(name=name, slug=slug, artist="Goose")
                session.add(song)
                session.commit()
                session.refresh(song)
            songs.append(song)

        # 3. Create Shows (if not exist)
        shows_data = [
            ("2023-10-06", "Red Rocks Amphitheatre", "Morrison, CO"),
            ("2023-10-05", "Red Rocks Amphitheatre", "Morrison, CO"),
            ("2023-06-22", "The Louisville Palace", "Louisville, KY"),
            ("2023-03-24", "The Met", "Philadelphia, PA"),
            ("2022-12-16", "1stBank Center", "Broomfield, CO")
        ]
        shows = []
        for date, venue, location in shows_data:
            show = session.exec(select(Show).where(Show.date == date)).first()
            if not show:
                show = Show(
                    elgoose_id=int(date.replace("-", "")),
                    date=date,
                    venue=venue,
                    location=location,
                    setlist_data="[]"
                )
                session.add(show)
                session.commit()
                session.refresh(show)
            shows.append(show)

        # 4. Create Performances and Votes
        blurbs = [
            "Absolute heater!",
            "Best version I've heard.",
            "Rick was on fire.",
            "Peter's keys were magic.",
            "Spuds holding it down.",
            "Incredible jam.",
            "Type II madness.",
            "Short but sweet.",
            "Dark and dirty.",
            "Bliss jam peak."
        ]
        
        for show in shows:
            for i, song in enumerate(songs):
                # Create performance if not exists
                perf = session.exec(select(SongPerformance).where(SongPerformance.song_id == song.id, SongPerformance.show_id == show.id)).first()
                if not perf:
                    perf = SongPerformance(
                        song_id=song.id,
                        show_id=show.id,
                        position=i+1,
                        set_number=1
                    )
                    session.add(perf)
                    session.commit()
                    session.refresh(perf)
                
                # Create random votes
                for user in users:
                    if random.random() > 0.7: # 30% chance to vote
                        vote = session.exec(select(Vote).where(Vote.user_id == user.id, Vote.performance_id == perf.id)).first()
                        if not vote:
                            rating = random.randint(7, 10)
                            blurb = random.choice(blurbs) if random.random() > 0.5 else None
                            vote = Vote(
                                user_id=user.id,
                                performance_id=perf.id,
                                rating=rating,
                                blurb=blurb,
                                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30))
                            )
                            session.add(vote)
                            session.commit()
                            session.refresh(vote)
                            log.info(f"Created vote by {user.username} for {song.name}")

                            # Create random comments on votes
                            if random.random() > 0.8:
                                comment_phrases = ['So good.', 'Mind blowing.', "Can't wait to see them again."]
                                comment = ReviewComment(
                                    vote_id=vote.id,
                                    user_id=random.choice(users).id,
                                    body=f"Totally agree with this rating! {random.choice(comment_phrases)}",
                                    created_at=datetime.utcnow() - timedelta(days=random.randint(0, 5))
                                )
                                session.add(comment)
                                session.commit()
                                log.info("Created comment on vote")

        log.info("Seeding complete!")

if __name__ == "__main__":
    main()
