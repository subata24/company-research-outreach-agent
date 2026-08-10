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
            max_results=5,
        )

        valid_results = []

        for result in results:
            if not isinstance(result, dict):
                continue

            title = result.get("title")
            body = result.get("body", "")
            href = result.get("href")

            # A result needs a title and source URL.
            # Body text is optional because some search results
            # may not provide a snippet.
            if not title or not href:
                logger.warning(
                    "search_web | Skipping result without title or href"
                )
                continue

            valid_results.append(
                {
                    "title": title,
                    "body": body or "",
                    "href": href,
                }
            )

        logger.info(
            f"search_web | Retrieved {len(valid_results)} valid results"
        )

        return valid_results

    except Exception as e:
        logger.error(
            f"search_web | Search failed: {e}"
        )

        return []