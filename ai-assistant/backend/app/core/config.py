from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "AI Personal Assistant"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/ai_assistant"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Vector DB
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_API_KEY: Optional[str] = None
    
    # AI Providers
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    GOOGLE_API_KEY: Optional[str] = None
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    
    # Voice
    WHISPER_MODEL: str = "large-v3"
    TTS_PROVIDER: str = "openai"  # openai, elevenlabs, local
    
    # Auth
    JWT_SECRET_KEY: str = "change-this-in-production-please"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Security
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Storage
    S3_ENDPOINT: Optional[str] = None
    S3_BUCKET: str = "ai-assistant-assets"
    
    # Features
    ENABLE_MEMORY: bool = True
    ENABLE_VISION: bool = True
    ENABLE_VOICE: bool = True
    ENABLE_SCREEN_SHARING: bool = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()