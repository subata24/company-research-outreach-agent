"""
Prompt for evaluating whether enough company information has been gathered.
"""

EVALUATION_PROMPT = """
You are evaluating whether enough company research has been collected to write
a personalized professional outreach email.

Company:
{company_name}

Company Overview:
{overview}

Recent News:
{news}

Determine whether the available information is sufficient.

Respond with ONLY one word:

YES
or
NO
"""