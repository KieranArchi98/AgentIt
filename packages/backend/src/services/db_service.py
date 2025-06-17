from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional
from datetime import datetime
from ..models.post import Post, Comment, Vote
from ..database.database import get_db

class DatabaseService:
    def __init__(self):
        self.db: AsyncSession = get_db()

    async def get_posts(self) -> List[Post]:
        """Get all posts ordered by creation date"""
        query = select(Post).order_by(desc(Post.created_at))
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_post(self, post_id: str) -> Optional[Post]:
        """Get a post by ID"""
        query = select(Post).where(Post.id == post_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def create_post(self, user_id: str, title: str, content: str, forum_id: str) -> Post:
        """Create a new post"""
        post = Post(
            user_id=user_id,
            title=title,
            content=content,
            forum_id=forum_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        self.db.add(post)
        await self.db.commit()
        await self.db.refresh(post)
        return post

    async def get_comments(self, post_id: str) -> List[Comment]:
        """Get all comments for a post"""
        query = select(Comment).where(Comment.post_id == post_id).order_by(Comment.created_at)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create_comment(self, user_id: str, post_id: str, content: str, parent_id: Optional[str] = None) -> Comment:
        """Create a new comment"""
        comment = Comment(
            user_id=user_id,
            post_id=post_id,
            content=content,
            parent_id=parent_id,
            created_at=datetime.utcnow()
        )
        self.db.add(comment)
        await self.db.commit()
        await self.db.refresh(comment)
        return comment

    async def create_or_update_vote(self, user_id: str, post_id: str, vote_type: str) -> Vote:
        """Create or update a vote"""
        # Check for existing vote
        query = select(Vote).where(
            Vote.user_id == user_id,
            Vote.post_id == post_id
        )
        result = await self.db.execute(query)
        existing_vote = result.scalar_one_or_none()

        if existing_vote:
            # Update existing vote
            existing_vote.vote_type = vote_type
            await self.db.commit()
            await self.db.refresh(existing_vote)
            return existing_vote
        else:
            # Create new vote
            vote = Vote(
                user_id=user_id,
                post_id=post_id,
                vote_type=vote_type,
                created_at=datetime.utcnow()
            )
            self.db.add(vote)
            await self.db.commit()
            await self.db.refresh(vote)
            return vote 