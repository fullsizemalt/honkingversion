import pytest
from fastapi.testclient import TestClient
from sqlmodel import create_engine, Session, SQLModel
from main import app  # Assuming your FastAPI app is in main.py
from database import get_session
import os

@pytest.fixture(name="session")
def session_fixture(tmp_path):
    temp_db_path = tmp_path / "test.db"
    DATABASE_URL = f"sqlite:///{temp_db_path}"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

    def override_get_session():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = override_get_session
    SQLModel.metadata.create_all(engine) # Create tables once per session fixture
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine) # Drop tables after session fixture

@pytest.fixture(name="client")
def client_fixture(session: Session): # Removed 'engine' from parameters
    # The get_session override is already set by the session_fixture
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()
