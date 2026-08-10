from app.graph.nodes import ResearchEvaluation


def test_research_evaluation_structure():
    evaluation = ResearchEvaluation(
        enough_info=True,
        reasoning="The research contains sufficient information.",
        missing_info=[]
    )

    assert evaluation.enough_info is True
    assert evaluation.reasoning != ""
    assert evaluation.missing_info == []