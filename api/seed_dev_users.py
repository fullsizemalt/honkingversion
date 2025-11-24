from sqlmodel import Session, SQLModel, select
from database import engine
from models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

DEV_USERS = [
    ("admin", "admin123", "admin"),
    ("testuser", "test123", "user"),
    ("poweruser", "power123", "power_user"),
    ("mod", "mod123", "mod"),
]


def upsert_user(session: Session, username: str, password: str, role: str):
    user = session.exec(select(User).where(User.username == username)).first()
    if user:
        user.hashed_password = pwd_context.hash(password)
        user.role = role
        print(f"Updated {username}")
    else:
        user = User(
            username=username,
            email=f"{username}@example.com",
            hashed_password=pwd_context.hash(password),
            role=role,
        )
        session.add(user)
        print(f"Created {username}")
    session.commit()


def main():
    # Ensure tables exist (metadata is defined in models import)
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        for username, password, role in DEV_USERS:
            upsert_user(session, username, password, role)


if __name__ == "__main__":
    main()
