from ddgs import DDGS
from langchain_core.tools import tool

@tool
def company_overview(company_name: str) -> list:
    """Searches the web for a general overview of a company."""
    ddgs = DDGS()

    query = f"{company_name} company overview"

    results = list(ddgs.text(query, max_results=3))

    return results