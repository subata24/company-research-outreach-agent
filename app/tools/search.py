from ddgs import DDGS

ddgs = DDGS()

def search_web(query: str):
    results = ddgs.text(query, max_results=5)
    return results