"""OpenAPI documentation configuration."""
from fastapi.openapi.utils import get_openapi
from fastapi import FastAPI

def custom_openapi(app: FastAPI):
    """Generate custom OpenAPI schema."""
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Forum API",
        version="1.0.0",
        description="""
        Forum API documentation.
        
        This API provides endpoints for managing a forum platform, including:
        * User authentication and management
        * Forum posts and comments
        * User profiles and preferences
        * Real-time notifications
        """,
        routes=app.routes,
    )

    # Add security schemes
    openapi_schema["components"]["securitySchemes"] = {
        "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    # Add global security requirement
    openapi_schema["security"] = [
        {
            "bearerAuth": []
        }
    ]

    # Add response examples
    openapi_schema["components"]["examples"] = {
        "UserResponse": {
            "value": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "email": "user@example.com",
                "username": "john_doe",
                "created_at": "2024-03-19T10:30:00Z"
            }
        },
        "ErrorResponse": {
            "value": {
                "detail": "Invalid credentials"
            }
        }
    }

    # Add tags metadata
    openapi_schema["tags"] = [
        {
            "name": "Authentication",
            "description": "Operations for user authentication"
        },
        {
            "name": "Users",
            "description": "Operations about users"
        },
        {
            "name": "Posts",
            "description": "Operations about forum posts"
        },
        {
            "name": "Comments",
            "description": "Operations about post comments"
        }
    ]

    app.openapi_schema = openapi_schema
    return app.openapi_schema 