from fastapi import FastAPI

from app.api.routes import router


app = FastAPI(
    title="Company Research & Outreach Agent",
    description=(
        "Agentic company research and personalized "
        "internship outreach email generator."
    ),
    version="1.0.0",
)


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "Company Research & Outreach Agent API is running."
    }


app.include_router(router)