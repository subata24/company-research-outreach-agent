"""
Tool for retrieving a general overview of a company.

This tool performs a web search to gather high-level information
about a company, which serves as the starting point for the agent's
research process.
"""

from ddgs import DDGS
from langchain_core.tools import tool

# Shared DDGS client
ddgs = DDGS()


@tool
def company_overview(company_name: str) -> list[dict]:
    """
    Retrieve a general overview of a company.

    Args:
        company_name: The name of the company.

    Returns:
        A list of search results containing general information
        about the company.
    """
    query = f"{company_name} company overview"

    results = ddgs.text(query, max_results=3)

    return list(results)