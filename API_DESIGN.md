# API Design Document

## Overview
The application uses a hybrid API approach:
1. FastAPI backend for core business logic
2. Supabase for authentication and real-time features
3. Next.js API routes for frontend-specific functionality

## API Versioning
- URL-based versioning: `/api/v1/*`
- Enables backward compatibility
- Facilitates gradual updates

## Authentication
### Supabase Authentication
- POST `/auth/sign-up`: User registration
- POST `/auth/sign-in`: User login
- POST `/auth/sign-out`: User logout
- GET `/auth/user`: Get current user
- POST `/auth/callback`: Handle email verification

### Profile Management
- GET `/api/v1/profiles/{id}`: Get user profile
- PUT `/api/v1/profiles/{id}`: Update user profile
- GET `/api/v1/profiles/me`: Get own profile
- PUT `/api/v1/profiles/me/avatar`: Update avatar

## Forums
### Categories
- GET `/api/v1/forums`: List all forums
- GET `/api/v1/forums/{id}`: Get forum details
- POST `/api/v1/forums`: Create forum (admin)
- PUT `/api/v1/forums/{id}`: Update forum (admin)
- DELETE `/api/v1/forums/{id}`: Delete forum (admin)

### Posts
- GET `/api/v1/posts`: List posts (with filters)
- GET `/api/v1/posts/{id}`: Get post details
- POST `/api/v1/posts`: Create post
- PUT `/api/v1/posts/{id}`: Update post
- DELETE `/api/v1/posts/{id}`: Delete post
- GET `/api/v1/forums/{id}/posts`: List forum posts

### Comments
- GET `/api/v1/posts/{id}/comments`: List post comments
- POST `/api/v1/posts/{id}/comments`: Add comment
- PUT `/api/v1/comments/{id}`: Update comment
- DELETE `/api/v1/comments/{id}`: Delete comment

### Votes
- POST `/api/v1/posts/{id}/vote`: Vote on post
- DELETE `/api/v1/posts/{id}/vote`: Remove vote
- GET `/api/v1/posts/{id}/votes`: Get vote count

## Real-time Subscriptions
### Supabase Realtime
- `posts`: Post updates
- `comments`: Comment updates
- `profiles`: Profile updates

## Response Formats

### Success Response
```json
{
  "data": {
    // Response data
  },
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 100
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

## Status Codes
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user
- Custom limits for specific endpoints

## Security
### Authentication
- JWT tokens via Supabase
- Token refresh mechanism
- CSRF protection

### Authorization
- Role-based access control
- Resource-based permissions
- Row Level Security in Supabase

## API Clients
### Frontend
```typescript
// Example API client usage
const api = {
  posts: {
    list: () => fetch('/api/v1/posts'),
    get: (id: string) => fetch(`/api/v1/posts/${id}`),
    create: (data: PostData) => fetch('/api/v1/posts', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
};
```

### Backend
```python
# Example FastAPI endpoint
@router.get("/posts/{post_id}")
async def get_post(
    post_id: int,
    current_user: User = Depends(get_current_user)
):
    return await post_service.get_post(post_id, current_user)
```

## Documentation
- OpenAPI/Swagger UI: `/docs`
- ReDoc: `/redoc`
- Postman Collection available
- API changelog maintained 