# 🤖 Company Research & Outreach Agent

An AI-powered research agent that investigates a company, finds recent news, evaluates whether enough information has been collected, performs follow-up research when necessary, and generates a personalized internship outreach email.

## ✨ Features

- 🏢 Company overview research
- 🔎 AI-generated search queries
- 📰 Recent company news discovery
- 🧠 Information sufficiency evaluation
- 🔄 Follow-up research when information is insufficient
- ✉️ Personalized internship outreach email generation
- 🛡️ Retry limit to prevent endless research loops
- 🖥️ Clean CLI report
- 🔗 LangGraph-based agent workflow

## 🧠 How It Works

The agent follows a state-based workflow:

```text
User enters company
        ↓
Company overview research
        ↓
Generate search query
        ↓
Search recent company news
        ↓
Evaluate information
        ↓
   ┌────┴────┐
   │         │
Enough?    Not enough
   │         │
   ↓         ↓
Write     Follow-up
Email     Search
   │         │
   │         └────→ Search News
   ↓
Final Report
```

---

## 🛠️ Tech Stack

- **Core:** Python
- **Agent Framework:** LangGraph, LangChain
- **LLM Provider:** Google Gemini
- **Search Engine:** Tavily / Web Search

---

## 📁 Project Structure

```text
company-research-outreach-agent/
│
├── app/
│   ├── agents/
│   ├── graph/
│   │   ├── nodes.py
│   │   ├── state.py
│   │   └── workflow.py
│   │
│   ├── prompts/
│   │   ├── email.py
│   │   ├── evaluation.py
│   │   ├── followup.py
│   │   └── search.py
│   │
│   ├── tools/
│   │   ├── company.py
│   │   └── search.py
│   │
│   └── utils/
│       ├── formatter.py
│       └── printer.py
│
├── tests/
├── main.py
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/subata24/company-research-outreach-agent.git
   cd company-research-outreach-agent
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv .venv
   ```

3. **Activate the virtual environment:**
   * **Windows:**
     ```bash
     .venv\Scripts\activate
     ```
   * **macOS/Linux:**
     ```bash
     source .venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

---

## 🔑 Environment Variables

Create a `.env` file in the project root directory:

```env
GOOGLE_API_KEY=your_google_api_key
TAVILY_API_KEY=your_tavily_api_key
```

> ⚠️ **Important:** Never commit your `.env` file or actual API keys to GitHub.

---

## ▶️ Run the Agent

Start the application with the following command:

```bash
python main.py
```

Enter a company name when prompted:
```text
Enter company name: NVIDIA
```

The agent will research the company and generate a personalized outreach email.

---

## 🔄 Agentic Research Loop

Unlike a simple linear pipeline, this agent evaluates the quality of its own research. If the collected information is insufficient, an evaluator routes the workflow to execute a follow-up search query.

### Workflow Logic
* **Research** \(\rightarrow\) **Evaluate** \(\rightarrow\) **Enough information?**
  * **Yes** \(\rightarrow\) Generate email.
  * **No** \(\rightarrow\) Follow-up search \(\rightarrow\) Research again.

*A built-in retry limit prevents the loop from running indefinitely.*

---

## 📊 Example Output

```text
🚀 Company Research & Outreach Agent
Researching: NVIDIA Please wait...

======================================================================
📊 COMPANY RESEARCH REPORT
======================================================================
🏢 Company: NVIDIA

🔎 Search Query Used
----------------------------------------------------------------------
NVIDIA latest product announcements and strategic partnerships 2026

📰 Latest News
----------------------------------------------------------------------
1. NVIDIA Newsroom
Latest company announcements and developments...

2. NVIDIA GTC 2026
Major announcements surrounding AI infrastructure...

======================================================================
✉️ GENERATED OUTREACH EMAIL
======================================================================
Subject: AI Internship Inquiry - [Your Name]

Dear NVIDIA Recruiting Team,

I am writing to express my strong interest...

======================================================================
✅ END OF REPORT
======================================================================
```

---

## 🚧 Future Improvements

* Better source ranking and filtering
* Duplicate news detection
* Company website discovery
* Internship vacancy detection
* LinkedIn and job-board integration
* Automated email delivery integration
* Persistent research history
* Structured research reports
* More robust evaluation criteria
* Human-in-the-loop approval before sending emails
