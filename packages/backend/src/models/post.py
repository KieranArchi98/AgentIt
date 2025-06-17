from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional

class Author(BaseModel):
    id: str
    name: str

class PostBase(BaseModel):
    title: str
    content: str
    forum_id: str
    user_id: Optional[str] = None

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: UUID4
    author: Author
    created_at: datetime
    votes: int = 0
    comments_count: int = 0

    class Config:
        from_attributes = True

class PostResponse(PostBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime
    votes: int = 0

    class Config:
        from_attributes = True

class CommentBase(BaseModel):
    content: str
    parent_id: Optional[UUID4] = None

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: UUID4
    post_id: UUID4
    user_id: str
    created_at: datetime
    updated_at: datetime
    votes: int = 0

    class Config:
        from_attributes = True

class VoteBase(BaseModel):
    vote_type: str  # 'up' or 'down'

class VoteCreate(VoteBase):
    pass

class VoteResponse(VoteBase):
    id: UUID4
    user_id: str
    post_id: Optional[UUID4] = None
    comment_id: Optional[UUID4] = None
    created_at: datetime

    class Config:
        from_attributes = True 