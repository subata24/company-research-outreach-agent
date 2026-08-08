# 🚀 Company Research & Outreach Agent

An AI-powered research assistant built with **LangGraph**, **LangChain**, **Google Gemini**, and **DuckDuckGo Search** that researches a company and generates a personalized internship outreach email.

> ⚠️ This project is currently under active development.

---

## ✨ Current Features

- 🔍 Research a company's overview
- 📰 Search for recent company news
- 🧠 Generate intelligent search queries using Gemini
- 📊 Evaluate whether enough information has been collected
- ✉️ Generate a personalized internship outreach email
- ⚙️ Built as a LangGraph workflow with modular nodes and tools

---

## 🛠️ Tech Stack

- Python
- LangGraph
- LangChain
- Google Gemini
- DuckDuckGo Search (DDGS)
- python-dotenv

---

## 📁 Project Structure

```
app/
├── graph/
│   ├── nodes.py
│   ├── state.py
│   └── workflow.py
├── prompts/
├── tools/
├── utils/
└── ...
```

---

## 🚀 Run Locally

Clone the repository

```bash
git clone https://github.com/your-username/company-research-outreach-agent.git
cd company-research-outreach-agent
```

Create a virtual environment

```bash
python -m venv .venv
```

Activate it

```bash
# Windows
.venv\Scripts\activate

# Linux / macOS
source .venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create a `.env` file

```env
GOOGLE_API_KEY=your_api_key_here
```

Run

```bash
python main.py
```

---

## 🎯 Roadmap

- ✅ Company overview retrieval
- ✅ Recent news retrieval
- ✅ Personalized email generation
- ✅ Agentic retry loop
- ✅ Multi-step reasoning
- 🔄 Better console progress tracking
- 🔄 Markdown/PDF report export
- 🔄 Company careers page research

---

## 📜 License

This project is for learning and portfolio purposes.
