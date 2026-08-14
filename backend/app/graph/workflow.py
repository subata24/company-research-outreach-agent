"""
LangGraph workflow definition.
"""

from langgraph.graph import StateGraph, START, END

from app.graph.state import AgentState

from app.graph.nodes import (
    get_company_overview,
    generate_search_query,
    search_company_news,
    evaluate_information,
    generate_followup_search_query,
    write_email,
    request_clarification,
    route_after_evaluation,
)


# Create the graph

builder = StateGraph(AgentState)


# Register nodes

builder.add_node(
    "get_company_overview",
    get_company_overview,
)

builder.add_node(
    "generate_search_query",
    generate_search_query,
)

builder.add_node(
    "search_company_news",
    search_company_news,
)

builder.add_node(
    "evaluate_information",
    evaluate_information,
)

builder.add_node(
    "generate_followup_search_query",
    generate_followup_search_query,
)

builder.add_node(
    "write_email",
    write_email,
)

builder.add_node(
    "request_clarification",
    request_clarification,
)


# Define execution flow

builder.add_edge(
    START,
    "get_company_overview",
)

builder.add_edge(
    "get_company_overview",
    "generate_search_query",
)

builder.add_edge(
    "generate_search_query",
    "search_company_news",
)

builder.add_edge(
    "search_company_news",
    "evaluate_information",
)

builder.add_conditional_edges(
    "evaluate_information",
    route_after_evaluation,
    {
        "generate_followup_search_query": "generate_followup_search_query",
        "write_email": "write_email",
        "request_clarification": "request_clarification",
    },
)

builder.add_edge(
    "generate_followup_search_query",
    "search_company_news",
)

builder.add_edge(
    "request_clarification",
    END,
)

builder.add_edge(
    "write_email",
    END,
)



# Compile the workflow

graph = builder.compile()