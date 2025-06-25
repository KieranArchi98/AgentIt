"""Authentication endpoints for API v1."""
from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel
from typing import Optional

from ....third_party.supabase_client import supabase
from ....middleware.auth import auth_scheme

router = APIRouter(prefix="/auth", tags=["Authentication"])

class AuthRequest(BaseModel):
    """Authentication request model."""
    email: str
    password: str

class AuthResponse(BaseModel):
    """Authentication response model."""
    access_token: str
    refresh_token: Optional[str]
    user_id: str

@router.post("/signup", response_model=AuthResponse)
async def signup(request: AuthRequest, response: Response):
    """Sign up a new user."""
    try:
        auth_response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password
        })
        
        # Set the access token as an HTTP-only cookie
        response.set_cookie(
            key="access_token",
            value=f"Bearer {auth_response.session.access_token}",
            httponly=True,
            secure=True,  # Only send over HTTPS
            samesite="lax"  # Protect against CSRF
        )
        
        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "user_id": auth_response.user.id
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=AuthResponse)
async def login(request: AuthRequest, response: Response):
    """Log in an existing user."""
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        
        # Set the access token as an HTTP-only cookie
        response.set_cookie(
            key="access_token",
            value=f"Bearer {auth_response.session.access_token}",
            httponly=True,
            secure=True,
            samesite="lax"
        )
        
        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "user_id": auth_response.user.id
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/logout")
async def logout(response: Response, token: str = Depends(auth_scheme)):
    """Log out the current user."""
    try:
        supabase.auth.sign_out()
        response.delete_cookie(key="access_token")
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me")
async def get_current_user(token: str = Depends(auth_scheme)):
    """Get the current user's information."""
    try:
        user = supabase.auth.get_user(token)
        return user.dict()
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e)) 