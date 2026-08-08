"""
Shared state for the Company Research & Outreach Agent.

Every LangGraph node reads from and writes to this state.
"""

from typing import TypedDict


class AgentState(TypedDict):
    """Represents the shared state passed between agent nodes."""
    
    company_name: str
    overview: list
    news: list
    search_query: str
    enough_information: bool
    evaluation_reasoning: str
    missing_information: list[str]
    email: str
    retry_count: int