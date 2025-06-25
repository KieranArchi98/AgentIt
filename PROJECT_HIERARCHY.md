# Project Hierarchy

## Overview
The project follows a monorepo structure with separate packages for frontend, backend, and shared code. This structure enables code sharing while maintaining clear boundaries between different parts of the application.

## Root Structure
```
/
├── packages/               # Main packages directory
│   ├── backend/           # Python/FastAPI backend
│   ├── web/              # Next.js frontend
│   └── shared/           # Shared types and utilities
├── architecture.md        # High-level architecture documentation
├── package.json          # Root package configuration
└── package-lock.json     # Dependency lock file
```

## Backend Structure (/packages/backend)
```
backend/
├── src/
│   ├── api/              # API endpoints and routing
│   ├── config/           # Configuration settings
│   ├── controllers/      # Business logic controllers
│   ├── database/        # Database configuration
│   ├── docs/            # API documentation
│   ├── middleware/      # Request/response middleware
│   ├── models/          # Database models
│   ├── services/        # Business logic services
│   ├── third_party/     # External service integrations
│   └── utils/           # Utility functions
├── migrations/          # Database migrations
├── tests/              # Test files
├── pyproject.toml      # Python project configuration
└── requirements.txt    # Python dependencies
```

## Frontend Structure (/packages/web)
```
web/
├── src/
│   ├── api/            # API client and endpoints
│   ├── components/     # React components
│   │   ├── common/    # Shared components
│   │   ├── forum/     # Forum-specific components
│   │   ├── layout/    # Layout components
│   │   └── ui/        # UI components (shadcn)
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities and configurations
│   ├── pages/         # Page components
│   ├── styles/        # CSS and styling
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── public/            # Static assets
└── package.json      # Frontend dependencies
```

## Shared Package (/packages/shared)
```
shared/
├── types/            # Shared TypeScript types
│   ├── index.ts     # Type exports
│   └── Post.ts      # Post-related types
├── package.json     # Shared package configuration
└── tsconfig.json    # TypeScript configuration
```

## Key Files

### Backend
- `pyproject.toml`: Python project configuration and dependencies
- `migrations/*.sql`: Database migration files
- `src/main.py`: Application entry point
- `src/config/settings.py`: Environment and app configuration

### Frontend
- `next.config.js`: Next.js configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `src/App.tsx`: Root React component
- `src/api/index.ts`: API client configuration

### Shared
- `types/index.ts`: Shared type definitions
- `tsconfig.json`: TypeScript configuration

## Dependencies

### Backend Dependencies
- FastAPI: Web framework
- SQLAlchemy: ORM
- Alembic: Database migrations
- Pydantic: Data validation
- pytest: Testing framework

### Frontend Dependencies
- Next.js: React framework
- Tailwind CSS: Styling
- shadcn/ui: UI components
- Supabase: Authentication and database
- TypeScript: Type safety

## Development Tools
- ESLint: JavaScript/TypeScript linting
- Prettier: Code formatting
- pytest: Python testing
- GitHub Actions: CI/CD
- Docker: Containerization 