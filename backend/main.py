from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.vi.endpoints.users.userRoutes import router as api_user


from backend.core.config import settings


app = FastAPI(
    title="Python Learning Platform API",
    description="API for interactive Python learning platform",
    version="1.0.0"
)

app.include_router(api_user, prefix=settings.API_V1_STR, tags=["api de pruebas de fastapi"])
