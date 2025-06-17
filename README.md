# Reddit-like Forum

A modern forum application built with React, FastAPI, and Supabase.

## Setup

1. Install dependencies:
   ```bash
   # Install root and frontend dependencies
   npm run install:all

   # Set up Python virtual environment and install backend dependencies
   cd packages/backend
   python -m venv venv
   .\venv\Scripts\activate  # On Windows
   pip install -r requirements.txt
   ```

2. Create environment files:

   In `packages/web/.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

   In `packages/backend/.env`:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

## Development

Start both frontend and backend servers:
```bash
npm run dev
```

This will start:
- Frontend at http://localhost:5173
- Backend at http://localhost:8000

## API Endpoints

- `GET /api/posts` - List all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/{post_id}` - Get a specific post
- `GET /api/posts/{post_id}/comments` - Get comments for a post
- `POST /api/posts/{post_id}/comments` - Add a comment to a post
- `POST /api/posts/{post_id}/vote` - Vote on a post

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Vite
  - TailwindCSS
  - Clerk (Authentication)
  - Supabase (Database)

- Backend:
  - FastAPI
  - Python
  - Supabase
  - Clerk 