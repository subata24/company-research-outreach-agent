from unittest.mock import patch

from app.tools.company import company_overview


def test_company_overview_returns_results():
    fake_results = [
        {
            "title": "Test Company",
            "body": "This is a test overview."
        }
    ]

    with patch(
        "app.tools.company.ddgs.text",
        return_value=fake_results
    ):
        result = company_overview.invoke({
            "company_name": "Test Company"
        })

    assert result == fake_results