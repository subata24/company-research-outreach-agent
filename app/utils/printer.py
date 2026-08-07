"""
Utility functions for displaying workflow results.
"""


def print_report(state: dict):
    print("\n" + "=" * 60)
    print("Company Research Report")
    print("=" * 60)

    print(f"\nCompany: {state['company_name']}")

    print("\nLatest News")
    print("-" * 60)

    if not state["news"]:
        print("No recent news found.")
    else:
        for i, news in enumerate(state["news"], start=1):
            print(f"{i}. {news['title']}")
            print(f"   {news['body'][:150]}...")
            print()

    print("\n" + "=" * 60)
    print("Generated Outreach Email")
    print("=" * 60)

    print(state["email"])