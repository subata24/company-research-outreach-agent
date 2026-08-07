"""
Main entry point for the Company Research & Outreach Agent.
"""

from app.graph.workflow import graph
from app.utils.printer import print_report


def main():
    while True:
        company_name = input("Enter company name: ").strip()

        if company_name:
            break

        print("❌ Company name cannot be empty. Please try again.")

    initial_state = {
        "company_name": company_name,
        "overview": [],
        "news": [],
        "search_query": "",
        "enough_information": False,
        "email": "",
        "retry_count": 0,
    }

    print("\n" + "=" * 60)
    print("🚀 Company Research & Outreach Agent")
    print("=" * 60)

    print(f"\nResearching: {company_name}")
    print("Please wait...\n")

    result = None

    for state in graph.stream(initial_state, stream_mode="values"):
        result = state

    print("✅ Research completed successfully!\n")

    print_report(result)


if __name__ == "__main__":
    main()