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

    print("\n🧠 Research Evaluation")
    print("-" * 70)

    status = "Yes" if state["enough_information"] else "No"
    print(f"Enough information: {status}")

    print("\nReasoning:")
    print(state.get("evaluation_reasoning", "No reasoning available."))

    print("\nMissing information:")

    missing = state.get("missing_information", [])

    if missing:
        for item in missing:
            print(f"- {item}")
    else:
        print("None")

    print("\n" + "=" * 70)
    print("✉️ GENERATED OUTREACH EMAIL")
    print("=" * 70)

    print(state["email"])

    print("\n" + "=" * 70)
    print("✅ END OF REPORT")
    print("=" * 70)