import pytest
from fastapi.testclient import TestClient
from datetime import datetime
from src.main import app
from src.config.database import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.models.base import Base

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create test database tables
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture
def test_user():
    return {
        "id": "test_user_id",
        "name": "Test User",
        "email": "test@example.com"
    }

@pytest.fixture
def test_post():
    return {
        "title": "Test Post",
        "content": "This is a test post content",
        "forum_id": "forum1"
    }

def test_create_post(test_user, test_post):
    # Mock authentication header
    headers = {"Authorization": f"Bearer test_token"}
    
    response = client.post(
        "/api/posts",
        headers=headers,
        json=test_post
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == test_post["title"]
    assert data["content"] == test_post["content"]
    assert data["forum_id"] == test_post["forum_id"]
    assert data["author"]["id"] == test_user["id"]
    assert "id" in data
    assert "created_at" in data

def test_get_posts():
    response = client.get("/api/posts")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    
    # Verify post structure
    if len(data) > 0:
        post = data[0]
        assert "id" in post
        assert "title" in post
        assert "content" in post
        assert "created_at" in post
        assert "author" in post
        assert "votes" in post
        assert "comments_count" in post

def test_get_posts_by_forum():
    forum_id = "forum1"
    response = client.get(f"/api/posts?forum_id={forum_id}")
    assert response.status_code == 200
    data = response.json()
    
    # Verify all posts belong to the specified forum
    for post in data:
        assert post["forum_id"] == forum_id

def test_get_post_by_id(test_user, test_post):
    # First create a post
    headers = {"Authorization": f"Bearer test_token"}
    create_response = client.post(
        "/api/posts",
        headers=headers,
        json=test_post
    )
    assert create_response.status_code == 201
    post_id = create_response.json()["id"]
    
    # Then get it by ID
    response = client.get(f"/api/posts/{post_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == post_id
    assert data["title"] == test_post["title"]
    assert data["content"] == test_post["content"]

def test_create_post_unauthorized():
    response = client.post(
        "/api/posts",
        json={
            "title": "Unauthorized Post",
            "content": "This should fail",
            "forum_id": "forum1"
        }
    )
    assert response.status_code == 401

def test_delete_post(test_user, test_post):
    # First create a post
    headers = {"Authorization": f"Bearer test_token"}
    create_response = client.post(
        "/api/posts",
        headers=headers,
        json=test_post
    )
    assert create_response.status_code == 201
    post_id = create_response.json()["id"]
    
    # Then delete it
    delete_response = client.delete(
        f"/api/posts/{post_id}",
        headers=headers
    )
    assert delete_response.status_code == 204
    
    # Verify it's deleted
    get_response = client.get(f"/api/posts/{post_id}")
    assert get_response.status_code == 404

def test_delete_post_unauthorized(test_user, test_post):
    # Create a post
    headers = {"Authorization": f"Bearer test_token"}
    create_response = client.post(
        "/api/posts",
        headers=headers,
        json=test_post
    )
    post_id = create_response.json()["id"]
    
    # Try to delete without auth
    delete_response = client.delete(f"/api/posts/{post_id}")
    assert delete_response.status_code == 401
    
    # Try to delete with different user
    different_headers = {"Authorization": f"Bearer different_user_token"}
    delete_response = client.delete(
        f"/api/posts/{post_id}",
        headers=different_headers
    )
    assert delete_response.status_code == 403 