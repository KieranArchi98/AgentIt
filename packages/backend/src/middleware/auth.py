from fastapi import Depends, HTTPException, Header
from typing import Optional
from jose import JWTError, jwt
from ..config.settings import settings

async def get_current_user(authorization: Optional[str] = Header(None)) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        # Remove 'Bearer ' prefix
        token = authorization.replace("Bearer ", "")
        # Verify the token with Clerk's public key
        payload = jwt.decode(token, settings.clerk_secret_key, algorithms=["HS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication token") 