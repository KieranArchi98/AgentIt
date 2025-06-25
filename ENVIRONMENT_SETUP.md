# Environment Setup Guide

## Prerequisites

### Required Software
- Node.js (v18+)
- Python (v3.11+)
- Docker
- Git
- VS Code (recommended)

### Accounts Needed
- GitHub account
- Supabase account
- Vercel account (for deployment)

## Initial Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/agentit.git
cd agentit
```

### 2. Frontend Setup
```bash
# Install dependencies
cd packages/web
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Backend Setup
```bash
# Create virtual environment
cd packages/backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
ENVIRONMENT=development
LOG_LEVEL=debug
```

## Database Setup

### 1. Supabase Setup
1. Create new project
2. Copy project URL and anon key
3. Run initial migrations:
```bash
cd packages/backend
python init_db_script.py
```

### 2. Local Development Database
```bash
# Start PostgreSQL container
docker run --name agentit-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=agentit \
  -p 5432:5432 \
  -d postgres
```

## Development Workflow

### 1. Start Frontend
```bash
cd packages/web
npm run dev
# Access at http://localhost:3000
```

### 2. Start Backend
```bash
cd packages/backend
uvicorn src.main:app --reload
# Access at http://localhost:8000
```

### 3. Watch for Changes
```bash
# In separate terminal
cd packages/web
npm run type-check:watch
```

## IDE Setup

### VS Code Extensions
- ESLint
- Prettier
- Python
- Tailwind CSS IntelliSense
- GitLens
- Docker

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "python.formatting.provider": "black",
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true
}
```

## Testing Setup

### Frontend Tests
```bash
cd packages/web
npm test        # Run tests
npm run test:watch  # Watch mode
```

### Backend Tests
```bash
cd packages/backend
pytest          # Run tests
pytest --watch  # Watch mode
```

## Docker Setup

### Development Environment
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Build
```bash
# Frontend
cd packages/web
docker build -t agentit-frontend .

# Backend
cd packages/backend
docker build -t agentit-backend .
```

## Common Issues

### 1. Database Connection
- Check PostgreSQL is running
- Verify connection string
- Check firewall settings

### 2. Node Modules
- Clear node_modules and reinstall
- Check Node.js version
- Verify package.json

### 3. Python Environment
- Recreate virtual environment
- Update pip
- Check Python version

## Maintenance

### 1. Dependencies
```bash
# Update frontend dependencies
cd packages/web
npm update

# Update backend dependencies
cd packages/backend
pip install --upgrade -r requirements.txt
```

### 2. Database Migrations
```bash
# Create migration
cd packages/backend
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head
```

### 3. Cleanup
```bash
# Clean frontend build
cd packages/web
npm run clean

# Clean Python cache
cd packages/backend
find . -type d -name "__pycache__" -exec rm -r {} +
```

## Security Setup

### 1. SSL/TLS
- Generate certificates
- Configure HTTPS
- Set up redirects

### 2. Environment Security
- Use secrets management
- Rotate keys regularly
- Implement rate limiting

### 3. Access Control
- Configure CORS
- Set up authentication
- Implement authorization

## Monitoring Setup

### 1. Application Monitoring
- Set up error tracking
- Configure logging
- Implement metrics

### 2. Performance Monitoring
- Set up APM
- Configure tracing
- Monitor resources

## Backup Setup

### 1. Database Backups
- Configure automated backups
- Set up restore procedures
- Test recovery process

### 2. Code Backups
- Set up Git remotes
- Configure backup schedule
- Document recovery steps 