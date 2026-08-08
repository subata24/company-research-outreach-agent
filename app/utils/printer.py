"""
Utility functions for displaying workflow results.
"""


def print_report(state: dict) -> None:
    """Display the final company research report and generated email."""

    print("\n" + "=" * 60)
    print("Company Research Report")
    print("=" * 60)

    print(f"\nCompany: {state['company_name']}")

    print("\nSearch Query Used")
    print("-" * 60)
    print(state.get("search_query", "N/A"))

    print("\nLatest News")
    print("-" * 60)

    if not state["news"]:
        print("No recent news found.")
    else:
        for index, news_item in enumerate(state["news"], start=1):
            print(f"\n{index}. {news_item.get('title', 'N/A')}")
            print(f"   {news_item.get('body', 'N/A')}")

    print("\n" + "=" * 60)
    print("Generated Outreach Email")
    print("=" * 60)

    print(state.get("email", "No email generated."))