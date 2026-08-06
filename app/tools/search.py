from langchain_core.tools import tool
from ddgs import DDGS

ddgs = DDGS()

@tool
def search_web(query: str) -> list:
    """Searches the web for recent information about any topic."""
    results = ddgs.text(query, max_results=5)
    return results