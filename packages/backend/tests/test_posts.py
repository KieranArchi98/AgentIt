from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_read_posts():
    response = client.get("/api/posts")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_post():
    # Mock authentication
    headers = {"Authorization": "Bearer test_token"}
    post_data = {
        "title": "Test Post",
        "content": "Test Content"
    }
    response = client.post("/api/posts", json=post_data, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == post_data["title"]
    assert data["content"] == post_data["content"] 