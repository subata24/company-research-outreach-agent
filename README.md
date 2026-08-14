# Company Research & Outreach Agent

An agentic AI application that researches a company, evaluates the quality of the information it finds, performs follow-up research when necessary, and generates a personalized internship outreach email.

Built with a **Next.js frontend**, **FastAPI backend**, **LangGraph** workflow orchestration, **Google Gemini**, and live web search — deployed as a single end-to-end application.

---

## Live Demo

**Production:** [company-research-outreach-agent.vercel.app](https://company-research-outreach-agent.vercel.app)

Enter a company name and the agent will research it before generating a personalized internship outreach email.

---

## Table of Contents

- [What Problem Does It Solve?](#what-problem-does-it-solve)
- [Why Is This Agentic?](#why-is-this-agentic)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Backend API](#backend-api)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security](#security)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

## What Problem Does It Solve?

Writing a personalized internship outreach email usually takes several manual steps:

1. Research the company
2. Find recent developments and news
3. Identify what's actually relevant to the candidate
4. Decide whether enough information has been collected
5. Do additional research if not
6. Write a personalized outreach email

This project turns those steps into a single **agentic workflow** — one that can decide for itself whether more research is needed, instead of following one fixed linear pipeline every time.

---

## Why Is This Agentic?

This is not simply:

```
Input → LLM → Output
```

The workflow contains a genuine **decision point**: the agent evaluates the information it has collected and routes itself accordingly.

```
Company Name
     │
     ▼
Research Company
     │
     ▼
Generate Search Query
     │
     ▼
Search Recent News
     │
     ▼
Evaluate Information
     │
     ┌────────────┴────────────┐
     │                         │
  Enough?                  Not Enough
     │                         │
     ▼                         ▼
Generate Email          Follow-up Research
                                │
                                ▼
                          Search Again
                                │
                                ▼
                         Evaluate Again
                                │
                                ▼
                         Generate Email
```

The evaluator can route the workflow back into research when the available information is insufficient. A **retry limit** prevents the agent from entering an endless research loop.

---

## Architecture

The application is deployed as two services inside a single Vercel project.

```
                         ┌───────────────────────┐
                         │         Vercel         │
                         │   Next.js + FastAPI    │
                         └───────────┬────────────┘
                                     │
                  ┌──────────────────┴──────────────────┐
                  │                                      │
                  ▼                                      ▼
         ┌──────────────────┐                 ┌──────────────────┐
         │ Next.js Frontend │                  │ FastAPI Backend  │
         └────────┬─────────┘                  └────────┬─────────┘
                  │                                      │
                  │                            /svc/api/*
                  │                                      │
                  │                                      ▼
                  │                           ┌──────────────────┐
                  │                           │ LangGraph Agent  │
                  │                           │    Workflow      │
                  │                           └────────┬─────────┘
                  │                                    │
                  │                  ┌─────────────────┼─────────────────┐
                  │                  ▼                 ▼                 ▼
                  │           Company Tool        Search Tool         Gemini
                  │                                    │
                  │                                    ▼
                  │                              Web Research
                  │
                  └───────────────── User Interface
```

### Request Flow

```
Browser
   │
   ▼
Next.js Frontend
   │
   ▼
/svc/api/research
   │
   ▼
FastAPI Backend
   │
   ▼
LangGraph Workflow
   │
   ├── Company Research
   ├── Search Query Generation
   ├── Recent News Research
   ├── Information Evaluation
   ├── Follow-up Research (when needed)
   └── Personalized Email Generation
   │
   ▼
Structured Response
   │
   ▼
Next.js UI
```

---

## Features

- 🏢 Company overview research
- 🔎 AI-generated research queries
- 📰 Recent company news discovery
- 🧠 AI-based research sufficiency evaluation
- 🔄 Conditional follow-up research
- 🛡️ Retry limit to prevent endless research loops
- ✉️ Personalized internship outreach email generation
- 🤖 LangGraph-based agent orchestration
- ⚡ FastAPI backend
- 🖥️ Next.js frontend
- ☁️ Vercel deployment with frontend/backend service routing

---

## Tech Stack

| Layer | Tools |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Backend** | Python, FastAPI, Pydantic |
| **AI / Agent** | LangGraph, LangChain, Google Gemini |
| **Research** | Web search, company research tools, news discovery |
| **Deployment** | Vercel (multi-service architecture) |

---

## Project Structure

```
company-research-outreach-agent/
│
├── api/
│   └── index.py
│
├── backend/
│   ├── main.py
│   └── app/
│       ├── api/
│       │   ├── main.py
│       │   └── routes.py
│       ├── graph/
│       │   ├── nodes.py
│       │   ├── state.py
│       │   └── workflow.py
│       ├── prompts/
│       │   ├── email.py
│       │   ├── evaluation.py
│       │   ├── followup.py
│       │   └── search.py
│       ├── schemas/
│       ├── tools/
│       │   ├── company.py
│       │   └── search.py
│       └── utils/
│           ├── formatter.py
│           ├── logger.py
│           ├── printer.py
│           └── progress.py
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── package.json
│   ├── next.config.ts
│   └── ...
│
├── tests/
│
├── main.py
├── requirements.txt
├── vercel.json
├── .env.example
├── .gitignore
└── README.md
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/subata24/company-research-outreach-agent.git
cd company-research-outreach-agent
```

### 2. Create a Python virtual environment

```bash
python -m venv .venv
```

Activate it:

```bash
# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate
```

### 3. Install backend dependencies

```bash
pip install -r requirements.txt
```

### 4. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

---

## Environment Variables

Create a `.env` file for local development:

```env
GOOGLE_API_KEY=your_google_api_key
GOOGLE_MODEL=your_gemini_model
```

If your search provider requires an API key, configure that locally as well.

A `.env.example` file is included to show the expected configuration without exposing real credentials.

> ⚠️ Never commit `.env`, API keys, or other secrets to GitHub.

---

## Running Locally

### Start the backend

From the project root:

```bash
python backend/main.py
```

### Start the frontend

In another terminal:

```bash
cd frontend
npm run dev
```

Then open **http://localhost:3000**.

---

## Backend API

The deployed backend is available internally through the `/svc/api` service route.

| Endpoint | Method | Description |
|---|---|---|
| `/svc/api/` | GET | Health check |
| `/svc/api/openapi.json` | GET | OpenAPI documentation |
| `/svc/api/research` | POST | Runs the research workflow |

**Example request:**

```json
{
  "company_name": "Google"
}
```

The endpoint returns the research results, workflow evaluation, generated search queries, company information, and the personalized outreach email.

---

## Testing

Run the test suite with:

```bash
pytest
```

You can also verify the deployed API manually (PowerShell):

```powershell
# Check OpenAPI
Invoke-RestMethod `
    -Uri "https://company-research-outreach-agent.vercel.app/svc/api/openapi.json" `
    -Method GET

# Test company research
$body = @{ company_name = "Google" } | ConvertTo-Json

Invoke-RestMethod `
    -Uri "https://company-research-outreach-agent.vercel.app/svc/api/research" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

---

## Deployment

The application is deployed using **Vercel Services**, split into two services:

- **Frontend** → Next.js
- **Backend** → FastAPI

Vercel routes backend requests through `/svc/api/*`, while normal application routes are handled by the frontend.

**Manual production deployment:**

```bash
vercel --prod
```

**Production domain:** [company-research-outreach-agent.vercel.app](https://company-research-outreach-agent.vercel.app)

### Continuous Deployment

The GitHub repository is connected to Vercel. After making changes locally:

```bash
git add .
git commit -m "Describe your change"
git push origin main
```

Vercel automatically creates a new deployment from the pushed commit — no need to manually run `vercel --prod` for routine changes.

---

## Security

The following files and directories should remain local and must never be committed:

```
.env
.env.local
.venv/
.vercel/
.next/
.pytest_cache/
node_modules/
```

Never expose API keys in source code, screenshots, README files, GitHub commits, or frontend client-side code.

---

## Future Improvements

- 🎯 Better source ranking and filtering
- 📰 Duplicate news detection
- 🌐 Company website discovery
- 💼 Internship vacancy detection
- 🔗 LinkedIn and job-board integration
- 📧 Automated email delivery
- 🗃️ Persistent research history
- 📊 Structured research reports
- 🧠 More robust research evaluation
- 👤 Human-in-the-loop approval before sending emails
- 🎨 More advanced frontend UX
- 📈 Research confidence and source-quality indicators
- 🔍 More precise company-specific opportunity discovery

---

## Project Goal

The goal of this project is to demonstrate how an agentic AI workflow can combine research, evaluation, conditional follow-up actions, and personalized generation into a practical end-to-end application.

Rather than calling an LLM once, the system can:

1. Research a company
2. Generate targeted search queries
3. Collect recent information
4. Evaluate the quality of that information
5. Decide whether more research is required
6. Perform follow-up research when necessary
7. Generate a personalized internship outreach email
8. Present the final result through a deployed web application

---

## Author

**Subata Khan**

- GitHub: [github.com/subata24](https://github.com/subata24)
- Project: [company-research-outreach-agent](https://github.com/subata24/company-research-outreach-agent)