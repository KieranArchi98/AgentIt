"""Main application module."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .api.v1 import router as v1_router
from .docs.openapi import custom_openapi
from .middleware.auth import auth_middleware
from .config.settings import get_settings

def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()
    
    app = FastAPI(
        title="AgentIT API",
        description="Backend API for AgentIT forum platform",
        version="1.0.0",
        docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
        redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    )

    # Custom OpenAPI schema
    app.openapi = lambda: custom_openapi(app)

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, replace with actual frontend domain
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Add authentication middleware
    app.middleware("http")(auth_middleware)

    # Register API versions
    app.include_router(v1_router)

    @app.get("/health")
    async def health_check():
        """Health check endpoint."""
        return JSONResponse(
            content={"status": "healthy", "version": "1.0.0"},
            status_code=200
        )

    @app.get("/")
    async def root():
        """Root endpoint."""
        return {
            "message": "Welcome to the Forum API",
            "version": "1.0.0",
            "docs_url": "/docs",
            "redoc_url": "/redoc"
        }

    return app

app = create_app() 