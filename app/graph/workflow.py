"""
LangGraph workflow definition.
"""

from langgraph.graph import StateGraph, START, END

from app.graph.nodes import (
    get_company_overview,
    generate_search_query,
    search_company_news,
    evaluate_information,
    write_email,
)
from app.graph.state import AgentState

# Create the graph
builder = StateGraph(AgentState)

# Register nodes
builder.add_node("get_company_overview", get_company_overview)
builder.add_node("generate_search_query", generate_search_query)
builder.add_node("search_company_news", search_company_news)
builder.add_node("evaluate_information", evaluate_information)
builder.add_node("write_email", write_email)

# Define execution flow
builder.add_edge(START, "get_company_overview")
builder.add_edge("get_company_overview", "generate_search_query")
builder.add_edge("generate_search_query", "search_company_news")
builder.add_edge(
    "search_company_news",
    "evaluate_information"
)
builder.add_conditional_edges(
    "evaluate_information",
    lambda state: state["enough_information"],
    {
    True: "write_email",
    False: END,
    },
)
builder.add_edge("write_email", END) 

# Compile the workflow
graph = builder.compile()