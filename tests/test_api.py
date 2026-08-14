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
            "/svc/api/research",
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
        "/svc/api/research",
        json={"company_name": ""}
    )

    assert response.status_code == 400
    assert response.json()["detail"] == (
        "Company name must contain at least 2 characters."
    )


def test_research_one_character_company():
    response = client.post(
        "/svc/api/research",
        json={"company_name": "I"}
    )

    assert response.status_code == 400


def test_research_workflow_failure():
    with patch(
        "app.api.routes.graph.stream",
        side_effect=Exception("Gemini API failed")
    ):
        response = client.post(
            "/svc/api/research",
            json={"company_name": "Intel"}
        )

    assert response.status_code == 500
    assert response.json()["detail"] == (
        "Research workflow failed. Please try again later."
    )


def test_research_followup_workflow():
    first_result = {
        "company_name": "TestCompany",
        "search_query": "TestCompany latest news",
        "news": [
            {
                "title": "Initial result",
                "body": "Limited information"
            }
        ],
        "enough_information": False,
        "evaluation_reasoning": "More information is needed.",
        "missing_information": ["Recent AI projects"],
        "email": "",
        "retry_count": 1,
    }

    second_result = {
        "company_name": "TestCompany",
        "search_query": "TestCompany recent AI projects",
        "news": [
            {
                "title": "AI project announced",
                "body": "TestCompany announced a new AI project."
            }
        ],
        "enough_information": True,
        "evaluation_reasoning": "Enough information found.",
        "missing_information": [],
        "email": "Subject: Internship Inquiry",
        "retry_count": 2,
    }

    with patch(
        "app.api.routes.graph.stream",
        return_value=iter([first_result, second_result])
    ) as mock_stream:

        response = client.post(
            "/svc/api/research",
            json={"company_name": "TestCompany"}
        )

    assert response.status_code == 200

    data = response.json()

    assert data["company"] == "TestCompany"
    assert data["search_query"] == (
        "TestCompany recent AI projects"
    )
    assert data["evaluation"]["enough_information"] is True
    assert data["evaluation"]["reasoning"] == (
        "Enough information found."
    )
    assert data["email"] == "Subject: Internship Inquiry"

    mock_stream.assert_called_once()