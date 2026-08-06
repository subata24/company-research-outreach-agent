"""
Prompt templates for search-related agent tasks.
"""

SEARCH_QUERY_PROMPT = """
You are helping personalize a professional job outreach email.

Today's year is 2026.

Company:
{company_name}

Overview:
{overview}

Your task is to determine what recent information would make the outreach
email more personalized and relevant.

Generate ONE Google search query that will retrieve recent and meaningful
company news.

Rules:
- Return ONLY the search query.
- Do NOT explain your reasoning.
- Do NOT use markdown.
- Do NOT use quotation marks.
- Do NOT use backticks.
- Use the current year (2026) if a year is needed.
"""