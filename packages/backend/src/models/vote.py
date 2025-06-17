from pydantic import BaseModel, UUID4
from enum import Enum
from typing import Optional

class VoteType(str, Enum):
    up = "up"
    down = "down"

class VoteBase(BaseModel):
    vote_type: VoteType

class VoteCreate(VoteBase):
    pass

class Vote(VoteBase):
    id: UUID4
    user_id: str
    post_id: Optional[UUID4] = None
    comment_id: Optional[UUID4] = None

    class Config:
        from_attributes = True

class VoteResponse(BaseModel):
    votes: int 