from pydantic import BaseModel, UUID4
from typing import Optional, List
from datetime import datetime

class CommentAuthor(BaseModel):
    id: str
    name: str

class CommentBase(BaseModel):
    content: str
    parent_id: Optional[UUID4] = None

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: UUID4
    post_id: UUID4
    author: CommentAuthor
    created_at: datetime
    votes: int = 0
    user_vote: Optional[str] = None

    class Config:
        from_attributes = True

class CommentResponse(Comment):
    replies: Optional[List['CommentResponse']] = None

    class Config:
        from_attributes = True 