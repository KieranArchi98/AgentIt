# Frontend `src` Directory Structure & File Purpose

This document explains the purpose of each file and folder in the `packages/web/src` directory, and clarifies the roles of key files and concepts in your frontend codebase.

---

## Top-Level Files & Folders

- **App.tsx**: Main React component. Sets up global providers (e.g., Clerk for auth, Toaster for notifications) and injects the router.
- **main.tsx**: Entry point for the React app. Renders `<App />` into the DOM.
- **routes.tsx**: Defines all frontend routes using `react-router-dom`, mapping URLs to page components and layouts.
- **env.d.ts**: TypeScript environment variable type definitions.

### Folders
- **api/**: Contains API utility files for communicating with your backend server (e.g., `index.ts` for REST API calls).
- **components/**: Reusable React components (UI, layout, forms, navigation, etc.).
- **contexts/**: React context providers (e.g., `AuthContext.tsx` for authentication state).
- **hooks/**: Custom React hooks for encapsulating logic (e.g., authentication, fetching posts, real-time updates).
- **lib/**: Utility libraries, database helpers, and configuration (e.g., `supabase.ts` for Supabase client setup).
- **middleware/**: Frontend logic for route validation, public route lists, and syncing user state (not server middleware).
- **pages/**: Top-level page components mapped to routes (e.g., Home, LoginPage, ForumPage, etc.).
- **styles/**: CSS and style-related files.
- **tests/**, **__tests__/**: Test files for components and logic.
- **types/**: TypeScript type definitions and interfaces (e.g., `Post.ts`).
- **utils/**: Utility/helper functions (e.g., `apiClient.ts` for Supabase DB access, `formatDate.ts`).

---

## Key File/Folder Explanations & Clarifications

### `apiClient.ts` (in utils/)
- **Purpose:** Provides functions to interact directly with the Supabase database from the frontend (e.g., fetch posts, create comments, toggle likes). This avoids unnecessary server round-trips for simple DB operations.
- **Not Next.js API routes:** This is not a Next.js API route file. Instead, it is a client-side utility for direct DB access using Supabase's JS SDK.

### `Post.ts` (in types/)
- **Purpose:** Defines TypeScript interfaces for `Post`, `Comment`, `Profile`, and `Vote` objects. These interfaces enforce structure and type safety for data exchanged between frontend, backend, and database.

### `middleware/`
- **Purpose:** Contains frontend logic for route validation and user state syncing. For example:
  - `auth.ts`: Syncs Clerk user info to Supabase and keeps user profiles up-to-date.
  - `publicRoutes.ts`: Lists routes that do not require authentication.
- **Not server middleware:** This is not server-side middleware; it runs in the browser to help manage auth and routing.

### `AuthContext.tsx` (in contexts/)
- **Purpose:** Provides a React context for authentication state using Supabase's auth system (not Clerk). It manages user login, signup, and logout, and exposes the current user to the app.
- **Difference from `auth.ts` middleware:**
  - `AuthContext.tsx` is a React context/provider for managing and accessing auth state in React components.
  - `auth.ts` (in middleware) is a hook for syncing Clerk user info to Supabase, ensuring the DB profile matches the auth provider.

### `index.ts` (in api/)
- **Purpose:** Initializes an Axios instance for making HTTP requests to your backend REST API (e.g., `/api/posts`). Handles token injection and error handling for API calls.
- **Not the app entry point:** This is not the entry point for the frontend app; it is just for backend API communication.

### `hooks/`
- **Purpose:** Contains custom React hooks for encapsulating logic and state management, such as:
  - `useAuth.ts`: Integrates Clerk auth with Supabase sessions.
  - `usePosts.ts`, `useRealtimePosts.ts`: Fetch and subscribe to posts.
  - `useRedirectAfterAuth.ts`: Handles redirecting users after authentication.
- **Role:** Hooks are used to share logic and manage state across components in a React/Next.js app.

---

## Example Component/Folder Purposes

- **components/Layout.tsx**: Main layout wrapper, includes navigation, sidebar, and footer.
- **components/Navigation.tsx**: Top navigation bar with links, user menu, and sign-in/out.
- **components/Sidebar.tsx**: Sidebar with quick links and forum list.
- **components/CreatePostForm.tsx**: Form for creating new posts.
- **components/PostCard.tsx**: Displays a single post summary.
- **components/ProtectedRoute.tsx**: Restricts access to child components unless the user is authenticated.
- **components/AuthLayout.tsx**: Layout for authentication-related pages.

---

## Summary Table

| Folder/File         | Purpose                                                                 |
|--------------------|-------------------------------------------------------------------------|
| api/               | Axios-based REST API calls to backend                                    |
| components/        | Reusable UI and layout components                                        |
| contexts/          | React context providers (e.g., auth)                                     |
| hooks/             | Custom React hooks for logic/state                                       |
| lib/               | Utility libraries, config, Supabase client                               |
| middleware/        | Frontend route validation, user sync logic                               |
| pages/             | Top-level route-mapped page components                                   |
| styles/            | CSS and style files                                                      |
| tests/, __tests__/ | Test files                                                               |
| types/             | TypeScript interfaces for data models                                    |
| utils/             | Helper functions (e.g., Supabase DB access, formatting)                  |

---

For further details, see the comments in each file or ask for a deep dive on any specific part! 