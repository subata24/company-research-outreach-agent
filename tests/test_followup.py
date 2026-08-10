from unittest.mock import patch

from app.graph.nodes import generate_followup_search_query


def test_followup_search_query():
    state = {
        "company_name": "Intel",
        "overview": [],
        "news": [],
        "search_query": "",
        "enough_information": False,
        "evaluation_reasoning": "More recent AI information is needed.",
        "missing_information": ["recent AI announcements"],
        "email": "",
        "retry_count": 1,
    }

    fake_response = type(
        "FakeResponse",
        (),
        {"text": "Intel latest AI announcements 2026"}
    )()

    with patch(
        "langchain_google_genai.ChatGoogleGenerativeAI.invoke",
        return_value=fake_response
   ):
        result = generate_followup_search_query(state)

    assert result["search_query"] == "Intel latest AI announcements 2026"