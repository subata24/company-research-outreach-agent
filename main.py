"""
Main entry point for the Company Research & Outreach Agent.
"""

from app.graph.workflow import graph
from app.utils.printer import print_report


def main():
    while True:
        company_name = input("Enter company name: ").strip()

        if not company_name:
            print("❌ Company name cannot be empty. Please try again.")
            continue

        if len(company_name) < 2:
            print("❌ Company name is too short. Please enter a valid company name.")
            continue

        break

    initial_state = {
    "company_name": company_name,
    "overview": [],
    "news": [],
    "search_query": "",
    "enough_information": False,
    "evaluation_reasoning": "",
    "missing_information": [],
    "email": "",
    "retry_count": 0,
}

    print("\n" + "=" * 60)
    print("🚀 Company Research & Outreach Agent")
    print("=" * 60)

    print(f"\nResearching: {company_name}")
    print("Please wait...\n")

    result = None

    try:
        for state in graph.stream(
            initial_state,
            stream_mode="values",
        ):
            result = state

    except Exception as e:
        print("\n❌ The research workflow failed.")
        print(f"Reason: {e}")
        return

    if result is None:
        print("\n❌ No result was produced.")
        return

    print("\n✅ Research completed successfully!")
    print_report(result)


if __name__ == "__main__":
    main()