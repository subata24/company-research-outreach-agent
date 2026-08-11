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
            }

        # Normal successful research response.
        return {
            "status": "success",
            "company": result["company_name"],
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
            "email": result["email"],
        }

    except HTTPException:
        raise

    except Exception as e:
        logger.error(
            f"research_company | Workflow failed: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Research workflow failed. Please try again later."
        )