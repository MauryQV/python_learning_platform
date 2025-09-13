# backend/core/database.py
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from typing import AsyncGenerator
from sqlalchemy.orm import declarative_base
from backend.core.config import settings
import asyncio

# Motor de base de datos asíncrono
engine = create_async_engine(
    settings.DATABASE_URL,  # Tu URL de Supabase Postgres
    echo=False,  
    future=True
)

# Creador de sesiones asíncronas
async_session_maker = async_sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

# Base para los modelos
Base = declarative_base()

# Función que FastAPI usará para obtener una sesión DB
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

# Función para crear las tablas (usar en startup)
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)