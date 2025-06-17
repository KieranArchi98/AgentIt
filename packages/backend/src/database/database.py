from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from ..config.settings import settings
import ssl

# Create SSL context for Supabase
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# Create async engine with SSL context for Supabase
engine = create_async_engine(
    settings.async_database_url,
    echo=True,  # Set to False in production
    pool_size=20,
    max_overflow=10,
    connect_args={
        "ssl": ssl_context,
        "server_settings": {"jit": "off"}
    }
)

# Create base class for declarative models
Base = declarative_base()

# Create async session factory
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def get_db():
    """Dependency for getting async database sessions"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close() 