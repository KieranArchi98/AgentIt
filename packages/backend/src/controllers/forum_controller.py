from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.database import Forum
from ..database.database import get_db
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[Forum])
async def get_forums(db: AsyncSession = Depends(get_db)) -> List[Forum]:
    """Get all forums"""
    try:
        result = await db.execute(select(Forum).order_by(Forum.name))
        forums = result.scalars().all()
        return forums
    except Exception as e:
        logger.error(f"Error getting forums: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{forum_id}", response_model=Forum)
async def get_forum(forum_id: str, db: AsyncSession = Depends(get_db)) -> Forum:
    """Get a forum by ID"""
    try:
        result = await db.execute(
            select(Forum).where(Forum.id == forum_id)
        )
        forum = result.scalar_one_or_none()
        if not forum:
            raise HTTPException(status_code=404, detail="Forum not found")
        return forum
    except Exception as e:
        logger.error(f"Error getting forum: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 