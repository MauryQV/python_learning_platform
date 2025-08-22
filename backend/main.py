from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.vi.endpoints.api import router as api
from backend.core.config import settings


app = FastAPI(
    title="Python Learning Platform API",
    description="API for interactive Python learning platform",
    version="1.0.0"
)

app.include_router(api, prefix=settings.API_V1_STR)