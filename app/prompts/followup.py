FOLLOWUP_SEARCH_PROMPT = """
You are researching a company.

Company:
{company_name}

Current Overview:
{overview}

Current News:
{news}

The information above was NOT sufficient to personalize an internship outreach email.

Think carefully.

What important information is still missing?

Generate ONE new Google search query.

Rules:
- Return only the query.
- Do not explain.
- Avoid repeating previous searches.
"""