from fastapi.testclient import TestClient
from sqlmodel import Session
from models import User
from routes.auth import get_current_user
from main import app

def get_current_user_override():
    return User(id=1, username="testuser", email="test@example.com", hashed_password="hashedpassword")

app.dependency_overrides[get_current_user] = get_current_user_override

client = TestClient(app)

def test_get_profile_settings():
    response = client.get("/settings/profile")
    assert response.status_code == 200
    data = response.json()
    assert "display_name" in data
    assert "bio" in data
    assert "profile_picture_url" in data

def test_update_profile_settings():
    response = client.put("/settings/profile", json={"display_name": "New Name", "bio": "New Bio"})
    assert response.status_code == 200
    data = response.json()
    assert data["display_name"] == "New Name"
    assert data["bio"] == "New Bio"

def test_update_profile_settings_too_long():
    response = client.put("/settings/profile", json={"display_name": "a" * 51})
    assert response.status_code == 422 # Unprocessable Entity from pydantic validation
    response = client.put("/settings/profile", json={"bio": "a" * 501})
    assert response.status_code == 422

def test_get_account_settings():
    response = client.get("/settings/account")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"

# Note: a lot of mocking is needed to test email and password change, so I will skip those for now
# and focus on the privacy settings, which was the main point of the refactoring.

def test_get_privacy_settings():
    response = client.get("/settings/privacy")
    assert response.status_code == 200
    data = response.json()
    assert "profile_visibility" in data
    assert "activity_visibility" in data

def test_update_privacy_settings():
    response = client.put("/settings/privacy", json={"profile_visibility": "unlisted", "activity_visibility": "followers"})
    assert response.status_code == 200
    data = response.json()
    assert data["settings"]["profile_visibility"] == "unlisted"
    assert data["settings"]["activity_visibility"] == "followers"

def test_update_privacy_settings_invalid():
    response = client.put("/settings/privacy", json={"profile_visibility": "invalid"})
    assert response.status_code == 422
