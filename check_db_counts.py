from sqlmodel import Session, select, create_engine, func
from api.models import ReviewComment, Vote, User, SongPerformance
from pathlib import Path

DB_PATH = Path("api/database.db")
engine = create_engine(f"sqlite:///{DB_PATH}")

with Session(engine) as session:
    user_count = session.exec(select(func.count(User.id))).one()
    vote_count = session.exec(select(func.count(Vote.id))).one()
    comment_count = session.exec(select(func.count(ReviewComment.id))).one()
    perf_count = session.exec(select(func.count(SongPerformance.id))).one()
    
    print(f"Users: {user_count}")
    print(f"Votes: {vote_count}")
    print(f"Comments: {comment_count}")
    print(f"Performances: {perf_count}")
