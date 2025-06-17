from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import jwt
from ..config.settings import settings
from ..models.database import User
from sqlalchemy.ext.asyncio import AsyncSession
from ..database.database import get_db
from sqlalchemy import select

router = APIRouter()
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Validate JWT token from Clerk and get or create user
    """
    try:
        # Verify the JWT token
        token = credentials.credentials
        # Note: In production, you should verify this with Clerk's public key
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication token")

        # Get or create user
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        
        if not user:
            # Create new user if they don't exist
            user = User(
                id=user_id,
                username=payload.get("username", f"user_{user_id[:8]}"),
                email=payload.get("email", "")
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
        
        return user
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user 