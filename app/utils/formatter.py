"""
Utility functions for formatting data before sending it to the LLM.
"""


def format_search_results(results: list) -> str:
    """
    Convert search results into readable text for LLM prompts.
    """

    if not results:
        return "No information found."

    formatted = []

    for index, result in enumerate(results, start=1):
        formatted.append(
            f"""
Result {index}

Title:
{result.get("title", "N/A")}

Summary:
{result.get("body", "N/A")}
"""
        )

    return "\n" + ("-" * 60).join(formatted)