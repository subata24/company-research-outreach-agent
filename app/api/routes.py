from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.graph.workflow import graph
from app.utils.logger import get_logger

router = APIRouter()

logger = get_logger(__name__)

class ResearchRequest(BaseModel):
    company_name: str


@router.post("/research")
def research_company(request: ResearchRequest):
    company_name = request.company_name.strip()

    if len(company_name) < 2:
        raise HTTPException(
            status_code=400,
            detail="Company name must contain at least 2 characters."
        )

    initial_state = {
        "company_name": company_name,
        "overview": [],
        "news": [],
        "search_query": "",
        "enough_information": False,
        "evaluation_reasoning": "",
        "missing_information": [],
        "email": "",
        "retry_count": 0,
        "clarification_needed": False,
        "clarification_message": "",
    }

    try:
        result = None

        for state in graph.stream(
            initial_state,
            stream_mode="values"
        ):
            result = state

        if result is None:
            raise HTTPException(
                status_code=500,
                detail="No result was produced."
            )

        logger.info(
            f"research_company | Completed for {company_name}"
        )

        # The agent could not confidently identify the company.
        if result.get("clarification_needed", False):
            logger.warning(
                f"research_company | "
                f"Clarification required for {company_name}"
            )
            
            return {
                "status": "clarification_required",
                "company": result["company_name"],
                "message": result.get(
                    "clarification_message",
                    "Please provide the company's full name or website."
                ),
                "reasoning": result.get(
                     "evaluation_reasoning",
                     ""
                ),
            }

        logger.info(
            f"research_company | Overview items: {len(result.get('overview', []))}"
        )
        logger.info(
            f"research_company | Overview data: {result.get('overview', [])}"
        )

        # Normal successful research response.
        return {
            "status": "success",
            "company": result["company_name"],
            "overview": result.get("overview", ""),
            "search_query": result["search_query"],
            "news": result["news"],

            "evaluation": {
                "enough_information": result["enough_information"],
                "needs_clarification": result.get(
                    "clarification_needed",
                    False
                ),
                "reasoning": result.get(
                    "evaluation_reasoning",
                    ""
                ),
                "missing_information": result.get(
                    "missing_information",
                    []
                ),
            },

            "workflow": {
                "company_identified": True,
                "search_strategy_generated": bool(
                    result.get("search_query")
                ),
                "research_completed": bool(
                    result.get("overview") or result.get("news")
                ),
                "research_evaluated": True,
                "follow_up_research": result.get(
                    "retry_count",
                    0
                ) > 0,
                "retry_count": result.get(
                    "retry_count",
                    0
                ),
                "email_generated": bool(
                    result.get("email")
                ),
            },

            "email": result["email"],
        }

    except Exception as e:
        logger.error(
            f"research_company | Workflow failed: {e}"
        )

        error_message = str(e).lower()

        if "web search service failed" in error_message:
            raise HTTPException(
                status_code=503,
                detail=(
                    "Web research is temporarily unavailable. "
                    "Please try again later."
                )
            )

        if "llm service failed" in error_message:
            raise HTTPException(
                status_code=503,
                detail=(
                    "The AI writing service is temporarily unavailable. "
                    "Please try again later."
                )
            )

        raise HTTPException(
            status_code=500,
            detail="Research workflow failed. Please try again later."
        )
    