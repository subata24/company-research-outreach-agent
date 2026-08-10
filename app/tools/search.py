"""
Web search tool for retrieving recent information.

This tool uses DuckDuckGo Search (DDGS) to perform
real-time web searches.
"""

from ddgs import DDGS
from langchain_core.tools import tool
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Shared DDGS client
ddgs = DDGS()


@tool
def search_web(query: str) -> list[dict]:
    """
    Search the web for recent information.
    """

    try:
        results = ddgs.text(
            query,
            max_results=5
        )

        return list(results)

    except Exception as e:
        logger.error(
            f"search_web | Search failed: {e}"
        )

        return []