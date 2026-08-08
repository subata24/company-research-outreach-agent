"""
LangGraph nodes for the Company Research & Outreach Agent.

Each node performs a single responsibility and returns only the
state updates that LangGraph should merge into the shared state.
"""

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

from app.graph.state import AgentState
from app.tools.company import company_overview
from app.prompts.search import SEARCH_QUERY_PROMPT
from app.tools.search import search_web
from app.prompts.evaluation import EVALUATION_PROMPT
from app.prompts.email import EMAIL_PROMPT
from app.prompts.followup import FOLLOWUP_SEARCH_PROMPT
from app.utils.formatter import format_search_results


# Load environment variables
load_dotenv()

# Shared LLM instance
llm = ChatGoogleGenerativeAI(
    model="gemini-3.1-flash-lite"
)

#llm = ChatGoogleGenerativeAI(
    #model="gemini-3.6-flash")


def get_company_overview(state: AgentState) -> dict:
    """
    Retrieve a high-level overview of the target company.
    """

    try:
        overview = company_overview.invoke(
            state["company_name"]
        )

        return {
            "overview": overview
        }

    except Exception as e:
        print(f"❌ Failed to retrieve company overview: {e}")

        return {
            "overview": []
        }


def generate_search_query(state: AgentState) -> dict:
    """
    Generate a focused web search query for recent company news.
    """

    try:
        prompt = SEARCH_QUERY_PROMPT.format(
            company_name=state["company_name"],
            overview=format_search_results(state["overview"])
        )

        response = llm.invoke(prompt)
        search_query = response.text.strip()

        return {
            "search_query": search_query
        }

    except Exception as e:
        print(f"❌ Failed to generate search query: {e}")

        return {
            "search_query": f"{state['company_name']} latest news 2026"
        }


def search_company_news(state: AgentState) -> dict:
    """
    Search for recent company news using the generated search query.
    """

    try:
        news = search_web.invoke(
            state["search_query"]
        )

        return {
            "news": news
        }

    except Exception as e:
        print(f"❌ Failed to search company news: {e}")

        return {
            "news": []
        }


def evaluate_information(state: AgentState) -> dict:
    """
    Determine whether enough information has been collected.
    """

    try:
        prompt = EVALUATION_PROMPT.format(
            company_name=state["company_name"],
            overview=format_search_results(state["overview"]),
            news=format_search_results(state["news"])
        )

        response = llm.invoke(prompt)

        decision = response.text.strip().upper()

        return {
            "enough_information": decision == "YES",
            "retry_count": state["retry_count"] + 1,
        }

    except Exception as e:
        print(f"❌ Failed to evaluate information: {e}")

        # If evaluation fails, don't keep retrying indefinitely.
        return {
            "enough_information": True,
            "retry_count": state["retry_count"] + 1,
        }
    

def route_after_evaluation(state: AgentState) -> str:
    """
    Decide whether to generate the email or perform another search.
    """

    if state["enough_information"]:
        return "write_email"

    if state["retry_count"] >= 3:
        return "write_email"

    return "generate_followup_search_query"


def generate_followup_search_query(state: AgentState) -> dict:
    """
    Generate a follow-up search query if the initial information is insufficient.
    """

    try:
        prompt = FOLLOWUP_SEARCH_PROMPT.format(
            company_name=state["company_name"],
            overview=format_search_results(state["overview"]),
            news=format_search_results(state["news"])
        )

        response = llm.invoke(prompt)

        return {
            "search_query": response.text.strip()
        }

    except Exception as e:
        print(f"❌ Failed to generate follow-up search query: {e}")

        return {
            "search_query": f"{state['company_name']} latest company news"
        }

def write_email(state: AgentState) -> dict:
    """
    Generate a personalized outreach email.
    """

    try:
        prompt = EMAIL_PROMPT.format(
            company_name=state["company_name"],
            overview=format_search_results(state["overview"]),
            news=format_search_results(state["news"]),
        )

        response = llm.invoke(prompt)

        return {
            "email": response.text.strip()
        }

    except Exception as e:
        print(f"❌ Failed to generate email: {e}")

        return {
            "email": (
                f"Unable to generate an outreach email for "
                f"{state['company_name']} because the AI service "
                f"is currently unavailable."
            )
        }