"""
Prompt for generating a personalized outreach email.
"""

EMAIL_PROMPT = """
You are an AI career assistant.

Write a concise, professional outreach email for an AI internship application.

Company:
{company_name}

Company Overview:
{overview}

Recent News:
{news}

Requirements:
- Mention one recent company achievement or announcement naturally.
- Show genuine interest in the company's work.
- Keep the email under 180 words.
- Maintain a professional tone.
- Do not invent facts.
- Return only the email.
"""