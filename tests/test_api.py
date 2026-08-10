from unittest.mock import patch

from fastapi.testclient import TestClient

from app.api.main import app


client = TestClient(app)


def test_research_success():
    fake_result = {
        "company_name": "Intel",
        "search_query": "Intel latest AI news",
        "news": [
            {
                "title": "Intel AI News",
                "body": "Test news"
            }
        ],
        "enough_information": True,
        "evaluation_reasoning": "Enough information found.",
        "missing_information": [],
        "email": "Subject: AI Internship Inquiry",
        "retry_count": 1,
    }

    with patch(
        "app.api.routes.graph.stream",
        return_value=iter([fake_result])
    ):
        response = client.post(
            "/research",
            json={"company_name": "Intel"}
        )

    assert response.status_code == 200

    data = response.json()

    assert data["company"] == "Intel"
    assert data["search_query"] == "Intel latest AI news"
    assert data["news"] == fake_result["news"]
    assert data["evaluation"]["enough_information"] is True
    assert data["evaluation"]["reasoning"] == "Enough information found."
    assert data["email"] == "Subject: AI Internship Inquiry"


def test_research_empty_company():
    response = client.post(
        "/research",
        json={"company_name": ""}
    )

    assert response.status_code == 400
    assert response.json()["detail"] == (
        "Company name must contain at least 2 characters."
    )


def test_research_one_character_company():
    response = client.post(
        "/research",
        json={"company_name": "I"}
    )

    assert response.status_code == 400


def test_research_workflow_failure():
    with patch(
        "app.api.routes.graph.stream",
        side_effect=Exception("Gemini API failed")
    ):
        response = client.post(
            "/research",
            json={"company_name": "Intel"}
        )

    assert response.status_code == 500
    assert response.json()["detail"] == (
        "Research workflow failed. Please try again later."
    )