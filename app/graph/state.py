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
    enough_information: bool
    email: str
    search_query: str
    retry_count: int