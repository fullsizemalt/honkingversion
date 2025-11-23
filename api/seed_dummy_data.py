
import logging
from datetime import datetime
from pathlib import Path
from sqlmodel import Session, SQLModel, create_engine, select
from models import Show, Song, SongPerformance, Vote, User, Tag, ShowTag

# Setup DB
DB_PATH = Path(__file__).parent / "database.db"
engine = create_engine(f"sqlite:///{DB_PATH}", echo=False)

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

def main():
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # Create Song
        song = session.exec(select(Song).where(Song.slug == "echo-of-a-rose")).first()
        if not song:
            song = Song(
                name="Echo of a Rose",
                slug="echo-of-a-rose",
                artist="Goose",
                is_cover=False,
                times_played=0
            )
            session.add(song)
            session.commit()
            session.refresh(song)
            log.info(f"Created song: {song.name}")
        
        # Create Show
        show = session.exec(select(Show).where(Show.date == "2023-10-06")).first()
        if not show:
            show = Show(
                elgoose_id=12345,
                date="2023-10-06",
                venue="Red Rocks Amphitheatre",
                location="Morrison, CO",
                setlist_data="[]"
            )
            session.add(show)
            session.commit()
            session.refresh(show)
            log.info(f"Created show: {show.date}")
            
        # Create Performance
        perf = session.exec(select(SongPerformance).where(SongPerformance.song_id == song.id, SongPerformance.show_id == show.id)).first()
        if not perf:
            perf = SongPerformance(
                song_id=song.id,
                show_id=show.id,
                position=1,
                set_number=1,
                notes="Fast version"
            )
            session.add(perf)
            session.commit()
            session.refresh(perf)
            log.info(f"Created performance for {song.name}")
            
        # Create User
        user = session.exec(select(User).where(User.username == "testuser")).first()
        if not user:
            user = User(
                username="testuser",
                email="test@example.com",
                hashed_password="dummy"
            )
            session.add(user)
            session.commit()
            session.refresh(user)
            log.info(f"Created user: {user.username}")
            
        # Create Vote
        vote = session.exec(select(Vote).where(Vote.user_id == user.id, Vote.performance_id == perf.id)).first()
        if not vote:
            vote = Vote(
                user_id=user.id,
                performance_id=perf.id,
                rating=9,
                blurb="Amazing energy!",
                is_featured=False
            )
            session.add(vote)
            session.commit()
            log.info("Created vote")
            
        log.info("Seeding complete!")

if __name__ == "__main__":
    main()
