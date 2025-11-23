from sqlmodel import Session, select, func
from database import engine
from models import Show

def check_shows():
    with Session(engine) as session:
        count = session.exec(select(func.count(Show.id))).one()
        print(f"Show count: {count}")
        if count > 0:
            first = session.exec(select(Show).limit(1)).first()
            print(f"First show ID: {first.id}, Date: {first.date}")

if __name__ == "__main__":
    check_shows()
