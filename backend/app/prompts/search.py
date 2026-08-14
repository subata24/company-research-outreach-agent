"""
Prompt templates for search-related agent tasks.
"""

SEARCH_QUERY_PROMPT = """
You are an AI research assistant researching a company for a personalized internship outreach email.

Company:
{company_name}

Company Overview:
{overview}

Generate ONE focused web search query for recent, meaningful company developments.

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

Query construction rules:
- Use the company name.
- Include 2-4 highly relevant topic keywords.
- Prefer official company/newsroom sources when appropriate.
- Focus the query on recent AI, ML, engineering, research, product, or technology developments.
- Do NOT include any year in the query.
- Do NOT include a specific date in the query.
- Do NOT assume a publication year from the company overview.
- Do NOT copy dates or years from the company overview into the query.
- Do NOT generate a generic "latest news" query.
- The search system will handle recency separately.

Return ONLY the search query.
Do not explain.
"""