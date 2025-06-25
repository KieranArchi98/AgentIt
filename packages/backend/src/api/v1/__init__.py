"""API v1 package initialization."""
from fastapi import APIRouter
from .endpoints import forums, posts

router = APIRouter()

router.include_router(forums.router, prefix="/forums", tags=["forums"])
router.include_router(posts.router, prefix="/posts", tags=["posts"])

__all__ = ["router"] 