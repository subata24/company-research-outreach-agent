"""
Structured output schema for research evaluation.
"""

from pydantic import BaseModel, Field


class ResearchEvaluation(BaseModel):
    """Represents the LLM's evaluation of collected research."""

    enough_info: bool = Field(
        description="Whether enough reliable information has been collected."
    )

    needs_clarification: bool = Field(
        description="Whether clarification is needed to complete the research."
    )


    reasoning: str = Field(
        description="Brief explanation of why the collected information is or is not sufficient."
    )

    missing_info: list[str] = Field(
        default_factory=list,
        description="Important information that is still missing from the research."
    )