"""Authentication middleware for Supabase."""
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
import os

class SupabaseJWTBearer(HTTPBearer):
    """JWT Bearer authentication for Supabase."""
    
    def __init__(self, auto_error: bool = True):
        super(SupabaseJWTBearer, self).__init__(auto_error=auto_error)
        self.jwt_secret = os.environ.get("SUPABASE_JWT_SECRET")

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(SupabaseJWTBearer, self).__call__(request)
        
        if not credentials:
            raise HTTPException(status_code=401, detail="Invalid authorization code.")
        
        if not credentials.scheme == "Bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme.")
            
        if not self.verify_jwt(credentials.credentials):
            raise HTTPException(status_code=401, detail="Invalid token or expired token.")
            
        return credentials.credentials

    def verify_jwt(self, token: str) -> bool:
        """Verify JWT token."""
        try:
            # Decode and verify the token
            payload = jwt.decode(
                token,
                self.jwt_secret,
                algorithms=["HS256"],
                audience="authenticated"
            )
            return True
        except JWTError:
            return False

    def get_user_id(self, token: str) -> str:
        """Get user ID from JWT token."""
        try:
            payload = jwt.decode(
                token,
                self.jwt_secret,
                algorithms=["HS256"],
                audience="authenticated"
            )
            return payload.get("sub")  # Supabase stores user ID in 'sub' claim
        except JWTError:
            return None

auth_scheme = SupabaseJWTBearer() 