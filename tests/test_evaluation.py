from app.graph.nodes import ResearchEvaluation


def test_research_evaluation_structure():
    evaluation = ResearchEvaluation(
        enough_info=True,
        needs_clarification=False,
        reasoning="The research contains sufficient information.",
        missing_info=[]
    )

    assert evaluation.enough_info is True
    assert evaluation.needs_clarification is False
    assert evaluation.reasoning == (
        "The research contains sufficient information."
    )
    assert evaluation.missing_info == []