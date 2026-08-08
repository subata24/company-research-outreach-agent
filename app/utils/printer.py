"""
Utility functions for displaying workflow results.
"""


def print_report(state: dict):
    print("\n" + "=" * 70)
    print("📊 COMPANY RESEARCH REPORT")
    print("=" * 70)

    print(f"\n🏢 Company: {state['company_name']}")

    print("\n🔎 Search Query Used")
    print("-" * 70)
    print(state["search_query"])

    print("\n📰 Latest News")
    print("-" * 70)

    if not state["news"]:
        print("No recent news found.")
    else:
        for index, news_item in enumerate(state["news"], start=1):
            print(f"\n{index}. {news_item.get('title', 'N/A')}")
            print(f"   {news_item.get('body', 'N/A')}")

    print("\n" + "=" * 70)
    print("✉️ GENERATED OUTREACH EMAIL")
    print("=" * 70)

    print(state["email"])

    print("\n" + "=" * 70)
    print("✅ END OF REPORT")
    print("=" * 70)