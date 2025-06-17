Create a Reddit-like forum website MVP with the following specifications:

**Tech Stack**:
- Frontend: React (TypeScript, Vite, Tailwind CSS, React Router), Clerk for authentication, Supabase JavaScript client for database and real-time updates.
- Backend: Python (FastAPI, Pydantic), Supabase Python client.
- Database: Supabase (PostgreSQL) with tables for users, posts, comments, and votes (schemas provided below).
- Deployment: Prepared for Vercel (frontend) and Render (backend).

**MVP Features**:
- Authentication: User signup/login via Clerk (SignIn component on /login route).
- Posts: Create posts (title, content), list posts on home page, view post details.
- Comments: Basic endpoint for adding threaded comments to posts.
- Voting: Basic endpoint for upvoting/downvoting posts.
- Real-Time: Subscribe to new posts on the home page using Supabase real-time.

**Monorepo Structure**:
- /packages/web: React frontend
  - /src/components/common: Button.tsx (basic button component).
  - /src/components/forum: PostCard.tsx (display post), CreatePostForm.tsx (form for post creation).
  - /src/pages: Home.tsx (post list with real-time), Login.tsx (Clerk SignIn), PostDetail.tsx (post details).
  - /src/hooks: useAuth.ts (Clerk user), usePosts.ts (fetch posts).
  - /src/types: Post.ts, Comment.ts, Vote.ts (TypeScript interfaces).
  - /src/utils: apiClient.ts (Supabase client).
  - /src/styles: tailwind.config.js, index.css (Tailwind CSS setup).
  - /: vite.config.ts, .env (for VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_CLERK_PUBLISHABLE_KEY), package.json.
- /packages/backend: FastAPI backend
  - /src/controllers: post_controller.py (GET /posts, POST /posts, POST /posts/{id}/comments, POST /posts/{id}/vote).
  - /src/services: db_service.py (Supabase client).
  - /src/models: post.py (Pydantic models for Post, Comment, Vote).
  - /src/middleware: auth_middleware.py (Clerk token validation).
  - /src/config: settings.py (load SUPABASE_URL, SUPABASE_SERVICE_KEY from .env).
  - /: main.py (FastAPI app), requirements.txt, .env.
- /packages/shared: Shared types
  - /types: Post.ts (shared TypeScript interface).
- /: package.json (npm Workspaces), .gitignore.

**Tasks**:
1. Initialize a monorepo with npm Workspaces, including /packages/web, /packages/backend, /packages/shared, and .gitignore (ignore node_modules, .env, dist, build).
2. Set up /packages/web as a Vite React-TypeScript project with Tailwind CSS, Clerk (@clerk/clerk-react), Supabase (@supabase/supabase-js), and React Router (react-router-dom).
3. Create frontend files:
   - Button.tsx: Simple reusable button.
   - PostCard.tsx: Display post title and content.
   - CreatePostForm.tsx: Form with title and content inputs, submits to Supabase.
   - Home.tsx: Fetch and display posts with Supabase real-time subscription.
   - Login.tsx: Clerk SignIn component.
   - PostDetail.tsx: Display post and comments (empty comments list for now).
   - useAuth.ts: Clerk hook to get current user.
   - usePosts.ts: Fetch posts from Supabase.
   - Post.ts, Comment.ts, Vote.ts: TypeScript interfaces.
   - apiClient.ts: Supabase client initialization.
   - tailwind.config.js, index.css: Tailwind CSS setup.
   - vite.config.ts: Basic Vite config.
   - .env: Placeholder for Supabase and Clerk keys.
4. Set up /packages/backend as a FastAPI project with Supabase Python client (supabase), Pydantic, and python-dotenv.
5. Create backend files:
   - post_controller.py: GET /posts (list posts), POST /posts (create post, auth required), POST /posts/{id}/comments (add comment), POST /posts/{id}/vote (add vote).
   - db_service.py: Supabase client setup.
   - post.py: Pydantic models for Post, Comment, Vote.
   - auth_middleware.py: Validate Clerk JWT.
   - settings.py: Load environment variables.
   - main.py: FastAPI app with router.
   - requirements.txt: List fastapi, uvicorn, supabase, pydantic, python-dotenv.
   - .env: Placeholder for Supabase keys.
6. Create /packages/shared/types/Post.ts with shared Post interface.
7. Add basic Jest test for PostCard.tsx and Pytest for post_controller.py.
8. Provide Supabase SQL schemas for manual setup:
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY,
     username TEXT NOT NULL,
     email TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   CREATE TABLE posts (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id),
     title TEXT NOT NULL,
     content TEXT NOT NULL,
     image_url TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   CREATE TABLE comments (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     post_id UUID REFERENCES posts(id),
     user_id UUID REFERENCES users(id),
     parent_id UUID REFERENCES comments(id),
     content TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   CREATE TABLE votes (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id),
     post_id UUID REFERENCES posts(id),
     comment_id UUID REFERENCES comments(id),
     vote_type TEXT CHECK (vote_type IN ('up', 'down')),
     created_at TIMESTAMP DEFAULT NOW()
   );