from fastapi import APIRouter, Depends, HTTPException
from typing import List
from pydantic import BaseModel
from ...database.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()

class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: str
    author_id: str
    author_name: str
    forum_id: int
    forum_name: str
    vote_count: int
    comment_count: int

@router.get("/popular", response_model=List[PostResponse])
async def get_popular_posts(limit: int = 10, db: Session = Depends(get_db)):
    """
    Get the most popular posts ordered by vote count
    """
    query = """
        SELECT 
            p.id,
            p.title,
            p.content,
            p.created_at,
            p.author_id,
            u.username as author_name,
            p.forum_id,
            f.name as forum_name,
            COUNT(DISTINCT v.id) as vote_count,
            COUNT(DISTINCT c.id) as comment_count
        FROM posts p
        LEFT JOIN users u ON p.author_id = u.id
        LEFT JOIN forums f ON p.forum_id = f.id
        LEFT JOIN votes v ON p.id = v.post_id AND v.vote_type = 'upvote'
        LEFT JOIN comments c ON p.id = c.post_id
        GROUP BY p.id, p.title, p.content, p.created_at, p.author_id, u.username, p.forum_id, f.name
        ORDER BY vote_count DESC, p.created_at DESC
        LIMIT :limit
    """
    
    result = db.execute(query, {"limit": limit})
    posts = result.fetchall()
    
    return [
        {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "created_at": post.created_at.isoformat(),
            "author_id": post.author_id,
            "author_name": post.author_name,
            "forum_id": post.forum_id,
            "forum_name": post.forum_name,
            "vote_count": post.vote_count,
            "comment_count": post.comment_count
        }
        for post in posts
    ] 