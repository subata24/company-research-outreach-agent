"""
Tool for retrieving a general overview of a company.

This tool performs a web search to gather high-level information
about a company, which serves as the starting point for the agent's
research process.
"""

from ddgs import DDGS
from langchain_core.tools import tool
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Shared DDGS client
ddgs = DDGS()


@tool
def company_overview(company_name: str) -> list[dict]:
    """
    Retrieve a general overview of a company.
    """

    try:
        query = f"{company_name} company overview"

        results = ddgs.text(
            query,
            max_results=3
        )

        return list(results)

    except Exception as e:
        logger.error(
            f"company_overview | Search failed: {e}"
        )

        return []