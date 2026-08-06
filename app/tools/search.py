"""
Web search tool for retrieving recent information.

This tool uses DuckDuckGo Search (DDGS) to perform
real-time web searches.
"""

from ddgs import DDGS
from langchain_core.tools import tool

# Shared DDGS client
ddgs = DDGS()


@tool
def search_web(query: str) -> list[dict]:
    """
    Search the web for recent information.

    Args:
        query: The search query.

    Returns:
        A list of search results, where each result is a dictionary
        containing information such as the title, URL, and snippet.
    """
    results = ddgs.text(query, max_results=5)

    return list(results)