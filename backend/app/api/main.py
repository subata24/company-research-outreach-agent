import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router


app = FastAPI(
    title="Company Research & Outreach Agent",
    description=(
        "Agentic company research and personalized "
        "internship outreach email generator."
    ),
    version="1.0.0",
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


app.include_router(router)


@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "Company Research & Outreach Agent",
    }