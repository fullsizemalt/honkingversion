from sqlmodel import Session, select, func
from database import engine
from models import Vote, Show, User

def check_votes():
    with Session(engine) as session:
        # Check show 1
        show = session.get(Show, 1)
        print(f"Show 1 exists: {show is not None}")
        
        # Check user 2 (list_test_user)
        user = session.get(User, 2)
        print(f"User 2 exists: {user is not None}")

        if show and user:
            # Try creating vote
            vote = Vote(user_id=user.id, show_id=show.id, rating=10, comment="Manual test")
            session.add(vote)
            try:
                session.commit()
                print("Vote created manually.")
            except Exception as e:
                print(f"Failed to create vote: {e}")
                session.rollback()

        count = session.exec(select(func.count(Vote.id))).one()
        print(f"Vote count: {count}")

if __name__ == "__main__":
    check_votes()
