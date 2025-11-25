import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select, SQLModel
from sqlmodel import create_engine
from api.database import get_session
from api.routes import settings as settings_router
from api.tests.utils.test_app import create_test_app

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from api.models import User
from api.routes.auth import get_current_user

@pytest.fixture(name="client_with_user")
def client_with_user_fixture(tmp_path):
    temp_db_path = tmp_path / "test.db"
    engine = create_engine(f"sqlite:///{temp_db_path}", connect_args={"check_same_thread": False})

    app_client = create_test_app(
        engine=engine,
        routers=[settings_router.router],
        get_session_dep=get_session,
    )

    with Session(engine) as session:
        user = User(username="testuser", email="test@example.com", hashed_password="hashedpassword")
        session.add(user)
        session.commit()

    def get_current_user_override():
        with Session(engine) as session:
            return session.exec(select(User).where(User.username == "testuser")).first()

    app_client.app.dependency_overrides[get_current_user] = get_current_user_override
    yield app_client
    app_client.app.dependency_overrides.clear()


def test_get_profile_settings(client_with_user: TestClient):
    response = client_with_user.get("/settings/profile")
    assert response.status_code == 200
    data = response.json()
    assert "display_name" in data
    assert "bio" in data
    assert "profile_picture_url" in data

def test_update_profile_settings(client_with_user: TestClient):
    response = client_with_user.put("/settings/profile", json={"display_name": "New Name", "bio": "New Bio"})
    assert response.status_code == 200
    data = response.json()
    assert data["display_name"] == "New Name"
    assert data["bio"] == "New Bio"

def test_update_profile_settings_too_long(client_with_user: TestClient):
    response = client_with_user.put("/settings/profile", json={"display_name": "a" * 51})
    assert response.status_code == 422
    assert "Display name must be 50 characters or less" in response.text
    response = client_with_user.put("/settings/profile", json={"bio": "a" * 501})
    assert response.status_code == 422
    assert "Bio must be 500 characters or less" in response.text

def test_get_account_settings(client_with_user: TestClient):
    response = client_with_user.get("/settings/account")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"

def test_get_privacy_settings(client_with_user: TestClient):
    response = client_with_user.get("/settings/privacy")
    assert response.status_code == 200
    data = response.json()
    assert "profile_visibility" in data
    assert "activity_visibility" in data

def test_update_privacy_settings(client_with_user: TestClient):
    response = client_with_user.put("/settings/privacy", json={"profile_visibility": "unlisted", "activity_visibility": "followers"})
    assert response.status_code == 200
    data = response.json()
    assert data["settings"]["profile_visibility"] == "unlisted"
    assert data["settings"]["activity_visibility"] == "followers"

def test_update_privacy_settings_invalid(client_with_user: TestClient):
    response = client_with_user.put("/settings/privacy", json={"profile_visibility": "invalid"})
    assert response.status_code == 422
