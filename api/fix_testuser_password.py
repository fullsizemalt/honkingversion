from sqlmodel import Session, select
from database import engine
from models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def fix_password():
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == "testuser")).first()
        if user:
            print(f"Found user: {user.username}")
            hashed = pwd_context.hash("dummy")
            user.hashed_password = hashed
            session.add(user)
            session.commit()
            print("Password updated successfully.")
        else:
            print("User testuser not found.")

if __name__ == "__main__":
    fix_password()
