from fastapi.testclient import TestClient
from sqlmodel import Session, select, SQLModel
from models import User
from routes.auth import get_current_user
import pytest

@pytest.fixture(name="client_with_user")
def client_with_user_fixture(session: Session):
    from main import app
    from tests.conftest import engine
    SQLModel.metadata.create_all(engine)
    user = User(id=1, username="testuser", email="test@example.com", hashed_password="hashedpassword")
    session.add(user)
    session.commit()

    def get_current_user_override():
        return User(id=1, username="testuser", email="test@example.com", hashed_password="hashedpassword")

    app.dependency_overrides[get_current_user] = get_current_user_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()
    SQLModel.metadata.drop_all(engine)


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
    if response.status_code != 422:
        print("Response JSON (test_update_profile_settings_too_long display_name):", response.json())
        print("Response text (test_update_profile_settings_too_long display_name):", response.text)
    assert response.status_code == 422
    assert "Display name must be 50 characters or less" in response.text
    response = client_with_user.put("/settings/profile", json={"bio": "a" * 501})
    if response.status_code != 422:
        print("Response JSON (test_update_profile_settings_too_long bio):", response.json())
        print("Response text (test_update_profile_settings_too_long bio):", response.text)
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
    if response.status_code != 422:
        print("Response JSON (test_update_privacy_settings_invalid):", response.json())
        print("Response text (test_update_privacy_settings_invalid):", response.text)
    assert response.status_code == 422
