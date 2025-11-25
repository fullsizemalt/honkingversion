from sqlmodel import create_engine, Session, SQLModel
from models import User
import pytest

DATABASE_URL = "sqlite:///./test_db.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

@pytest.fixture(name="session")
def session_fixture():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)

def test_create_user(session: Session):
    user = User(username="testuser", email="test@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()
    session.refresh(user)
    assert user.id is not None
    assert user.profile_visibility == "public"
