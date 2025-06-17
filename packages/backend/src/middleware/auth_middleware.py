from fastapi import Depends, HTTPException, Header
from typing import Optional
from jose import JWTError, jwt
from ..config.settings import settings

async def get_current_user(authorization: Optional[str] = Header(None)) -> str:
    """
    Validate Clerk JWT token and return user ID
    
    Args:
        authorization: Bearer token from request header
        
    Returns:
        str: User ID from JWT claims
        
    Raises:
        HTTPException: If token is missing or invalid
    """
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    try:
        # Remove 'Bearer ' prefix
        token = authorization.replace("Bearer ", "")
        
        # Verify the token with Clerk's public key
        # Note: In production, you should fetch and cache Clerk's JWKS
        payload = jwt.decode(
            token,
            settings.clerk_secret_key,
            algorithms=["HS256"],
            options={"verify_aud": False}  # Clerk uses dynamic audiences
        )
        
        # Get user ID from sub claim
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token claims"
            )
            
        return user_id
        
    except JWTError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        ) 