"""
LangGraph nodes for the Company Research & Outreach Agent.

Each node performs a single responsibility and returns only the
state updates that LangGraph should merge into the shared state.
"""
import os
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
from app.schemas.evaluation import ResearchEvaluation
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Load environment variables
load_dotenv()

# Shared LLM instance

llm = ChatGoogleGenerativeAI(
    model=os.getenv("GOOGLE_MODEL", "gemini-3.1-flash-lite")
)

def get_company_overview(state: AgentState) -> dict:
    """
    Retrieve a high-level overview of the target company.
    """

    try:
        logger.info(
            f"get_company_overview | Started for {state['company_name']}"
        )

        overview = company_overview.invoke(
            state["company_name"]
        )

        logger.info(
            "get_company_overview | Retrieved overview"
        )

        return {
            "overview": overview
        }

    except Exception as e:
        logger.error(
            f"get_company_overview | Failed: {e}"
        )

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

        logger.info("generate_search_query | Started")

        response = llm.invoke(prompt)
        search_query = response.text.strip()

        logger.info(
            f"generate_search_query | Query: {search_query}"
        )

        return {
            "search_query": search_query
        }

    except Exception as e:
        logger.error(
            f"generate_search_query | Failed: {e}"
        )

        return {
            "search_query": f"{state['company_name']} latest news 2026"
        }


def search_company_news(state: AgentState) -> dict:
    """
    Search for recent company news using the generated search query.
    """

    logger.info("search_company_news | Started")

    try:
        news = search_web.invoke(state["search_query"])

        logger.info(
            f"search_company_news | Retrieved {len(news)} results"
        )

        return {
            "news": news
        }

    except Exception as e:
        logger.error(
            f"search_company_news | Search failed: {e}"
        )

        return {
            "news": []
        }

        

def evaluate_information(state: AgentState) -> dict:
    """
    Determine whether enough information has been collected
    using structured LLM output.
    """

    # No search results means we definitely need more research.
    if not state["news"]:
        logger.warning(
            "evaluate_information | No news results found"
        )

        return {
            "enough_information": False,
            "needs_clarification": False,
            "evaluation_reasoning": (
                "No web search results were found. "
                "Additional research is required."
            ),
            "missing_information": [
                "Recent company information"
            ],
            "retry_count": state["retry_count"] + 1,
        }

    prompt = EVALUATION_PROMPT.format(
        company_name=state["company_name"],
        overview=format_search_results(state["overview"]),
        news=format_search_results(state["news"])
    )

    try:
        logger.info("evaluate_information | Started")

        structured_llm = llm.with_structured_output(
            ResearchEvaluation
        )

        evaluation = structured_llm.invoke(prompt)

        logger.info(
            f"evaluate_information | "
            f"enough_info={evaluation.enough_info}"
        )

        logger.info(
            f"evaluate_information | "
            f"needs_clarification={evaluation.needs_clarification}"
        )

        logger.info(
            f"evaluate_information | "
            f"reasoning={evaluation.reasoning}"
        )

        return {
            "enough_information": evaluation.enough_info,
            "clarification_needed": evaluation.needs_clarification,
            "evaluation_reasoning": evaluation.reasoning,
            "missing_information": evaluation.missing_info,
            "retry_count": state["retry_count"] + 1,
        }

    except Exception as e:
        logger.error(
            f"evaluate_information | Evaluation failed: {e}"
        )

        # If evaluation itself fails, don't keep retrying indefinitely.
        return {
            "enough_information": True,
            "clarification_needed": False,
            "retry_count": state["retry_count"] + 1,
        }
    

def route_after_evaluation(state: AgentState) -> str:
    """
    Decide what the agent should do after evaluating research.
    """

    # The company could not be identified confidently.
    # Stop researching and ask the user for clarification.
    if state.get("clarification_needed", False):
        logger.warning(
            "route_after_evaluation | "
            "Clarification required for company identification"
        )
        return "request_clarification"

    # Research is sufficient.
    if state["enough_information"]:
        return "write_email"

    # Prevent unlimited research loops.
    if state["retry_count"] >= 3:
        logger.warning(
            "route_after_evaluation | Maximum retries reached"
        )
        return "write_email"

    # More research is still useful.
    return "generate_followup_search_query"


def request_clarification(state: AgentState) -> dict:
    """
    Prepare a message asking the user to clarify the target company.
    """

    logger.warning(
        f"request_clarification | "
        f"Unable to confidently identify {state['company_name']}"
    )

    message = (
        f'I could not confidently identify the company '
        f'"{state["company_name"]}". '
        "Please provide the company's full name or website "
        "so I can research the correct organization."
    )

    return {
        "clarification_needed": True,
        "clarification_message": message,
        "email": "",
    }


def generate_followup_search_query(state: AgentState) -> dict:
    """
    Generate a follow-up search query when the initial research
    does not contain enough information.
    """

    logger.info(
        "generate_followup_search_query | Started"
    )

    try:
        prompt = FOLLOWUP_SEARCH_PROMPT.format(
            company_name=state["company_name"],
            overview=format_search_results(state["overview"]),
            news=format_search_results(state["news"]),
            missing_information=", ".join(
                state.get("missing_information", [])
            ),
        )

        response = llm.invoke(prompt)
        search_query = response.text.strip()

        logger.info(
            f"generate_followup_search_query | Query: {search_query}"
        )

        return {
            "search_query": search_query
        }

    except Exception as e:
        logger.error(
            f"generate_followup_search_query | Failed: {e}"
        )

        return {
            "search_query": (
                f"{state['company_name']} latest news 2026"
            )
        }

def write_email(state: AgentState) -> dict:
    """
    Generate a personalized outreach email.
    """

    try:
        logger.info("write_email | Started")

        prompt = EMAIL_PROMPT.format(
            company_name=state["company_name"],
            overview=format_search_results(state["overview"]),
            news=format_search_results(state["news"]),
        )

        response = llm.invoke(prompt)

        logger.info(
            "write_email | Email generated successfully"
        )

        return {
            "email": response.text.strip()
        }

    except Exception as e:
        logger.error(
            f"write_email | Email generation failed: {e}"
        )

        return {
            "email": (
                f"Unable to generate an outreach email for "
                f"{state['company_name']} because the AI service "
                f"is currently unavailable."
            )
        }