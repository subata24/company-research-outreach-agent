"""
LangGraph workflow definition.

This module will be responsible for assembling the agent's workflow
using LangGraph. For now, it only imports the shared state and nodes.

Future responsibilities:
- Build the StateGraph
- Register nodes
- Define graph edges
- Compile the workflow
"""

from app.graph.nodes import (
    generate_search_query,
    get_company_overview,
)
from app.graph.state import AgentState