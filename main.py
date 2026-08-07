"""
Main entry point for the Company Research & Outreach Agent.
"""

from app.graph.workflow import graph


def main():
    initial_state = {
        "company_name": "Microsoft",
        "overview": [],
        "news": [],
        "search_query": "",
        "enough_information": False,
        "email": "",
    }

    result = graph.invoke(initial_state)

    print(result)


if __name__ == "__main__":
    main()