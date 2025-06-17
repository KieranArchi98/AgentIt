from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.controllers.post_controller import router as post_router
from src.controllers.auth_controller import router as auth_router
from src.controllers.forum_controller import router as forum_router
from src.config.settings import settings
from .database.init_db import init_db

app = FastAPI(title="Reddit-like Forum API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(post_router, prefix="/posts", tags=["posts"])
app.include_router(forum_router, prefix="/forums", tags=["forums"])

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    await init_db()

@app.get("/")
async def root():
    return {"message": "Welcome to Reddit-like Forum API"} 