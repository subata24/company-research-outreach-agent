import os

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router


app = FastAPI(
    title="Company Research & Outreach Agent",
    description=(
        "Agentic company research and personalized "
        "internship outreach email generator."
    ),
    version="1.0.0",
    openapi_url="/svc/api/openapi.json",
    docs_url="/svc/api/docs",
    redoc_url="/svc/api/redoc",
)


frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


svc_api = APIRouter(prefix="/svc/api")


@svc_api.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "Company Research & Outreach Agent",
    }


svc_api.include_router(router)

app.include_router(svc_api)