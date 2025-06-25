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
    VITE_SUPABASE_URL: str | None = "https://exqrejzynhrsebvenckq.supabase.co"
    VITE_SUPABASE_ANON_KEY: str | None = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4cXJlanp5bmhyc2VidmVuY2txIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjQxNzksImV4cCI6MjA2NTYwMDE3OX0.2_TITFyiQdfkYo7nbZoCobTBYWqA4623i2KrUnolzsE"
    VITE_CLERK_PUBLISHABLE_KEY: str | None = "pk_test_cnVsaW5nLWNyYXlmaXNoLTEwLmNsZXJrLmFjY291bnRzLmRldiQ"
    VITE_API_URL: str | None = "http://localhost:8000"
    VITE_POSTHOG_KEY: str | None = "phc_3xrJA0ypg8TjJXDUhNK3iZl51LXKbXU8ObaU01cneH2"
    
    # Supabase settings
    SUPABASE_URL: str = "https://exqrejzynhrsebvenckq.supabase.co"  # This should be set from environment variable
    SUPABASE_KEY: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4cXJlanp5bmhyc2VidmVuY2txIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjQxNzksImV4cCI6MjA2NTYwMDE3OX0.2_TITFyiQdfkYo7nbZoCobTBYWqA4623i2KrUnolzsE"  # This should be set from environment variable
    
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