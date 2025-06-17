from typing import List, Optional
from datetime import datetime
from ..config.settings import settings
from ..models.post import Post, PostCreate, PostUpdate
from ..database.database import get_db

class PostService:
    def __init__(self):
        self.db = get_db()

    async def create_post(self, post: PostCreate, user_id: str) -> Post:
        """Create a new post"""
        db_post = Post(
            **post.dict(),
            user_id=user_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        self.db.add(db_post)
        await self.db.commit()
        await self.db.refresh(db_post)
        return db_post

    async def get_posts(self, forum_id: Optional[str] = None, limit: int = 10, offset: int = 0) -> List[Post]:
        """Get all posts, optionally filtered by forum"""
        query = self.db.query(Post)
        if forum_id:
            query = query.filter(Post.forum_id == forum_id)
        return await query.order_by(Post.created_at.desc()).offset(offset).limit(limit).all()

    async def get_post(self, post_id: str) -> Optional[Post]:
        """Get a post by ID"""
        return await self.db.query(Post).filter(Post.id == post_id).first()

    async def update_post(self, post_id: str, post_update: PostUpdate, user_id: str) -> Optional[Post]:
        """Update a post"""
        db_post = await self.get_post(post_id)
        if not db_post or db_post.user_id != user_id:
            return None
        
        update_data = post_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_post, field, value)
        
        db_post.updated_at = datetime.utcnow()
        await self.db.commit()
        await self.db.refresh(db_post)
        return db_post

    async def delete_post(self, post_id: str, user_id: str) -> bool:
        """Delete a post"""
        db_post = await self.get_post(post_id)
        if not db_post or db_post.user_id != user_id:
            return False
        
        await self.db.delete(db_post)
        await self.db.commit()
        return True

    async def get_comments(self, post_id: str):
        response = self.db.query(Comment).filter(Comment.post_id == post_id).all()
        return response

    async def create_comment(self, user_id: str, post_id: str, content: str, parent_id: Optional[str] = None):
        comment_data = {
            'user_id': user_id,
            'post_id': post_id,
            'content': content,
            'parent_id': parent_id
        }
        db_comment = Comment(**comment_data)
        self.db.add(db_comment)
        await self.db.commit()
        await self.db.refresh(db_comment)
        return db_comment

    async def create_vote(self, user_id: str, post_id: str, vote_type: str):
        vote_data = {
            'user_id': user_id,
            'post_id': post_id,
            'vote_type': vote_type
        }
        db_vote = Vote(**vote_data)
        self.db.add(db_vote)
        await self.db.commit()
        await self.db.refresh(db_vote)
        return db_vote 