from typing import TypedDict
from app.tools.company import company_overview
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash"
)

class AgentState(TypedDict):
    company_name: str
    overview: list
    news: list
    enough_information: bool
    email: str
    search_query: str



def generate_search_query(state: AgentState):
    prompt = f"""
You are helping personalize a job outreach email.

Today's year is 2026.

Company:
{state["company_name"]}

Overview:
{state["overview"]}

Generate ONE Google search query that will find RECENT company news.

Rules:
- Return ONLY the search query.
- Do NOT use markdown.
- Do NOT use backticks.
- Use the current year (2026) if a year is needed.
"""

    response = llm.invoke(prompt)

    return {
        "search_query": response.text.strip()
    }

def get_company_overview(state: AgentState):
    results = company_overview.invoke(state["company_name"])

    return {
    "overview": results
    }


def search_company_news(state: AgentState):
    print("Searching recent news...")

state = {
    "company_name": "Microsoft",
    "overview": company_overview.invoke("Microsoft"),
    "news": [],
    "enough_information": False,
    "email": "",
    "search_query": ""
}

print(generate_search_query(state))