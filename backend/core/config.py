from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Python Learning Platform"
    
    # Supabase Settings
    SUPABASE_URL: str
    SUPABASE_KEY: str
   
    
    # Database
    DATABASE_URL: Optional[str] = None
    
  
    
    class Config:
        env_file = ".env"

settings = Settings()