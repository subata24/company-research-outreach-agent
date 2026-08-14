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


Your task is to evaluate the research using THREE separate questions:

1. Is the target company/entity confidently identifiable?
2. Is enough reliable information available to write a personalized outreach email?
3. Is clarification from the user genuinely required?


IMPORTANT RULES FOR CLARIFICATION:

Set needs_clarification to TRUE ONLY when the identity of the target company
cannot be determined with reasonable confidence.

Examples where clarification IS required:
- The company name is extremely ambiguous, such as "al".
- Search results clearly refer to multiple unrelated companies/entities with
  the same or very similar name.
- The available information cannot establish which company the user intended.

Examples where clarification is NOT required:
- The company is clearly identifiable but recent company-specific news is
  limited.
- Search results are imperfect or contain some generic industry articles.
- The company has a recognizable and consistent profile across the overview
  and search results.
- A company such as "Systems Limited", "Devsinc", "Intel", or "Xeven Solutions"
  can be identified even if some recent search results are weak.

DO NOT confuse "insufficient recent news" with "ambiguous company identity".

If the company identity is clear but more information is needed, set:
needs_clarification = false
enough_info = false

In that situation, the agent should perform another research search rather
than asking the user for clarification.

If the company identity is ambiguous, set:
needs_clarification = true
enough_info = false

If the company identity is clear and there is enough useful information to
write a relevant personalized email, set:
needs_clarification = false
enough_info = true


The reasoning should briefly explain your decision.

missing_info should contain the most important information that is still
missing. If no important information is missing, return an empty list.

Return the result using the provided structured output schema.
"""