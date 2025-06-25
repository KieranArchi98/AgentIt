from fastapi import APIRouter, Depends, HTTPException
from typing import List
from pydantic import BaseModel
from ...database.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()

class ForumResponse(BaseModel):
    id: int
    name: str
    description: str
    created_at: str
    post_count: int
    last_activity: str | None

@router.get("/", response_model=List[ForumResponse])
async def list_forums(db: Session = Depends(get_db)):
    """
    Get a list of all forums with their post counts and last activity
    """
    query = """
        SELECT 
            f.id,
            f.name,
            f.description,
            f.created_at,
            COUNT(p.id) as post_count,
            MAX(p.created_at) as last_activity
        FROM forums f
        LEFT JOIN posts p ON p.forum_id = f.id
        GROUP BY f.id, f.name, f.description, f.created_at
        ORDER BY f.name ASC
    """
    
    result = db.execute(query)
    forums = result.fetchall()
    
    return [
        {
            "id": forum.id,
            "name": forum.name,
            "description": forum.description,
            "created_at": forum.created_at.isoformat(),
            "post_count": forum.post_count,
            "last_activity": forum.last_activity.isoformat() if forum.last_activity else None
        }
        for forum in forums
    ] 