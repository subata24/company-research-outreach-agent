from unittest.mock import patch

from app.tools.search import search_web


def test_search_web_returns_results():
    fake_results = [
        {
            "title": "Test Company News",
            "body": "This is a test result."
        }
    ]

    with patch(
        "app.tools.search.ddgs.text",
        return_value=fake_results
    ):
        result = search_web.invoke({
            "query": "Intel latest news"
        })

    assert result == fake_results