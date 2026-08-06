"""
Shared state for the Company Research & Outreach Agent.

Every LangGraph node reads from and writes to this state.
"""

from typing import Any, TypedDict


class AgentState(TypedDict):
    """Represents the shared state passed between agent nodes."""

    company_name: str
    overview: list[dict[str, Any]]
    news: list[dict[str, Any]]
    search_query: str
    enough_information: bool
    email: str