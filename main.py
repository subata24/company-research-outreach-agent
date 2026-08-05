from app.tools.search import search_web

results = search_web("Tesla latest news")

for result in results:
    print(f"Title: {result['title']}")
    print(f"URL: {result['href']}")
    print(f"Summary: {result['body']}")
    print("-" * 50)