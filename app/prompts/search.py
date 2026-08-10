"""
Prompt templates for search-related agent tasks.
"""

SEARCH_QUERY_PROMPT = """
You are an AI research assistant researching a company for a personalized internship outreach email.

Company:
{company_name}

Company Overview:
{overview}

Generate ONE focused Google search query for recent, meaningful company developments.

The search should prioritize information useful for personalizing an AI/ML internship outreach email.

Look for:
- Recent AI or technology initiatives
- Product or platform launches
- Major engineering developments
- Research or infrastructure announcements
- Strategic partnerships relevant to AI/technology
- Recent company announcements

Avoid:
- Stock prices
- Financial-market pages
- Generic company profile pages
- Wikipedia
- Job aggregators
- Unrelated entertainment or consumer content
- Generic "latest news" queries

Prefer recent sources from:
- The company's official website/newsroom
- Reputable technology publications
- Major business publications
- Official company announcements

The search should prioritize:
- Recent company announcements
- Recent AI or technology initiatives
- Product launches
- Strategic partnerships
- Research or engineering developments
- Careers or internship-relevant developments

IMPORTANT:
- Prioritize the most recent available information.
- Do NOT invent or assume a year.
- Do NOT use outdated years such as 2024 or 2025 unless the company
  specifically has no recent relevant information.
- Prefer official company/newsroom sources when possible.
- Return ONLY the search query.


Return ONLY the search query.
Do not explain.
"""