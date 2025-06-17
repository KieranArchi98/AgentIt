from pydantic_settings import BaseSettings
from typing import List
import json

class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = ""  # This should be set from environment variable
    
    @property
    def async_database_url(self) -> str:
        """Convert DATABASE_URL to async format if needed"""
        if self.DATABASE_URL.startswith('postgresql://'):
            return self.DATABASE_URL.replace('postgresql://', 'postgresql+asyncpg://', 1)
        return self.DATABASE_URL
    
    # JWT settings
    JWT_SECRET: str = "your-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    
    # Vite environment variables
    VITE_SUPABASE_URL: str | None = None
    VITE_SUPABASE_ANON_KEY: str | None = None
    VITE_CLERK_PUBLISHABLE_KEY: str | None = None
    VITE_API_URL: str | None = None
    VITE_POSTHOG_KEY: str | None = None
    
    # Supabase settings
    SUPABASE_URL: str = ""  # This should be set from environment variable
    SUPABASE_KEY: str = ""  # This should be set from environment variable
    
    # Clerk settings (optional)
    CLERK_PUBLISHABLE_KEY: str | None = None
    
    # PostHog settings (optional)
    POSTHOG_KEY: str | None = None
    
    # API settings
    API_URL: str = "http://localhost:8000"

    class Config:
        env_file = ".env"
        case_sensitive = True
        
        @classmethod
        def parse_env_var(cls, field_name: str, raw_val: str):
            if field_name == "CORS_ORIGINS" and raw_val.startswith("["):
                return json.loads(raw_val)
            return raw_val

settings = Settings() 