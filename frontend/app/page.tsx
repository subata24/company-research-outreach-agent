"use client";

import { useState } from "react";

type ResearchItem = {
  title: string;
  body?: string;
  href?: string;
};

type NewsItem = {
  title: string;
  body?: string;
  href?: string;
};

type ResearchEvaluation = {
  enough_information: boolean;
  needs_clarification: boolean;
  reasoning: string;
  missing_information: string[];
};

type ResearchWorkflow = {
  company_identified: boolean;
  search_strategy_generated: boolean;
  research_completed: boolean;
  research_evaluated: boolean;
  follow_up_research: boolean;
  retry_count: number;
  email_generated: boolean;
};

type ResearchResult = {
  status: "success";
  company: string;
  overview: ResearchItem[];
  search_query: string;
  news: NewsItem[];
  evaluation: ResearchEvaluation;
  workflow: ResearchWorkflow;
  email: string;
};

type ClarificationResult = {
  status: "clarification_required";
  company: string;
  message: string;
};

type Result = ResearchResult | ClarificationResult;

export default function Home() {
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleResearch() {
    if (!company.trim()) {
      setError("Please enter a company name.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/research`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_name: company.trim(),
          }),
        }
      );

      let data: Result | { detail?: string };

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The backend returned an invalid response. Please try again."
        );
      }


      console.log("API RESPONSE:", data);

      if (!response.ok) {
        const errorData = data as { detail?: string };

        throw new Error(
          errorData.detail || "Research failed. Please try again."
        );
      }

      setResult(data as Result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyEmail() {
    if (!result || result.status !== "success") {
      return;
    }

    if (!result.email) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result.email);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Could not copy the email to your clipboard.");
    }
  }

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-250px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute bottom-[-250px] left-[-150px] h-[400px] w-[400px] rounded-full bg-purple-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            AI-Powered Research Agent
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Company Research
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              &amp; Outreach Agent
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Research a company, analyze the latest information, and generate a
            personalized internship outreach email in seconds. If the company
            name is ambiguous, the agent will ask for clarification.
          </p>
        </header>

        {/* Search */}
        <section className="mx-auto mb-10 max-w-3xl">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="company"
                type="text"
                value={company}
                onChange={(event) => {
                  setCompany(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !loading) {
                    handleResearch();
                  }
                }}
                placeholder="Enter a company name or website..."
                className="min-w-0 flex-1 rounded-xl border border-transparent bg-transparent px-5 py-4 text-base text-white outline-none placeholder:text-gray-600 focus:border-white/10"
              />

              <button
                type="button"
                onClick={handleResearch}
                disabled={loading}
                className="rounded-xl bg-blue-600 px-7 py-4 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Researching..." : "Research Company"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </section>

        {/* Loading */}
        {loading && (
          <section className="mx-auto mb-10 max-w-3xl rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-400/20 border-t-blue-400" />

            <h2 className="font-semibold">
              Researching {company.trim()}...
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Gathering company information, analyzing recent news, and
              generating your outreach email.
            </p>
          </section>
        )}

        {/* Clarification required */}
        {result?.status === "clarification_required" && (
          <section className="mx-auto max-w-3xl rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-xl">
                ⚠️
              </div>

              <div>
                <h2 className="text-lg font-semibold text-amber-300">
                  Company identification needed
                </h2>

                <p className="mt-2 text-sm leading-7 text-gray-400">
                  {result.message}
                </p>

                <p className="mt-4 text-sm text-gray-500">
                  Try entering the company&apos;s full name, official website,
                  or another detail that uniquely identifies it.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Normal results */}
        {result?.status === "success" && (
          <div className="space-y-6">
            {/* Company header */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Research completed for
                  </p>

                  <h2 className="mt-1 text-3xl font-bold">
                    {result.company}
                  </h2>
                </div>

                <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Research complete
                </div>
              </div>
            </section>

            {/* Company intelligence */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-lg">
                  🏢
                </div>

                <div>
                  <h2 className="font-semibold">Company intelligence</h2>

                  <p className="text-sm text-gray-500">
                    Information gathered about the organization
                  </p>
                </div>
              </div>

              {result.overview?.length > 0 ? (
                <div className="space-y-4">
                  {result.overview.map((item, index) => (
                    <article
                      key={index}
                      className="rounded-xl border border-white/5 bg-black/20 p-5 transition hover:border-cyan-500/20"
                    >
                      <div className="flex gap-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-sm font-semibold text-cyan-300">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="min-w-0">
                          <h3 className="font-medium leading-6 text-gray-100">
                            {item.title}
                          </h3>

                          {item.body && (
                            <p className="mt-2 text-sm leading-7 text-gray-400">
                              {item.body}
                            </p>
                          )}

                          {item.href && (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-block text-sm font-medium text-cyan-400 transition hover:text-cyan-300 hover:underline"
                            >
                              View source →
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-white/5 bg-black/20 p-5 text-sm text-gray-500">
                  No company overview information was available.
                </div>
              )}
            </section>


            {/* Agent workflow */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-lg">
                  🧠
                </div>

                <div>
                  <h2 className="font-semibold">Agent workflow</h2>
                  <p className="text-sm text-gray-500">
                    How the research agent reached the final result
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Company identified */}
                <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    ✓
                  </div>

                  <div>
                    <p className="font-medium text-gray-200">Company identified</p>
                    <p className="text-sm text-gray-500">
                      Target organization was successfully identified.
                    </p>
                  </div>
                </div>

                {/* Search strategy */}
                <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    ✓
                  </div>

                  <div>
                    <p className="font-medium text-gray-200">
                      Search strategy generated
                    </p>
                    <p className="text-sm text-gray-500">
                      The agent generated a targeted research query.
                    </p>
                  </div>
                </div>

                {/* Research */}
                <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    ✓
                  </div>

                  <div>
                    <p className="font-medium text-gray-200">
                      Company information researched
                    </p>
                    <p className="text-sm text-gray-500">
                      Company intelligence and recent information were gathered.
                    </p>
                  </div>
                </div>

                {/* Evaluation */}
                <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    ✓
                  </div>

                  <div>
                    <p className="font-medium text-gray-200">
                      Research quality evaluated
                    </p>
                    <p className="text-sm text-gray-500">
                      The agent evaluated whether enough information was available.
                    </p>
                  </div>
                </div>

                {/* Follow-up */}
                <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-black/20 p-4">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      result.workflow.follow_up_research
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {result.workflow.follow_up_research ? "✓" : "–"}
                  </div>

                  <div>
                    <p className="font-medium text-gray-200">Follow-up research</p>

                    <p className="text-sm text-gray-500">
                      {result.workflow.follow_up_research
                        ? `Additional research was performed (${result.workflow.retry_count} follow-up ${
                            result.workflow.retry_count === 1 ? "search" : "searches"
                          }).`
                        : "Not required — the initial research was sufficient."}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    ✓
                  </div>

                  <div>
                    <p className="font-medium text-gray-200">
                      Personalized email generated
                    </p>

                    <p className="text-sm text-gray-500">
                      The final outreach email was generated from the research findings.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Research snapshot */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-8">
              <div className="mb-6">
                <h2 className="font-semibold">Research snapshot</h2>

                <p className="mt-1 text-sm text-gray-500">
                  Structured summary of the agent&apos;s research
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-white/5 bg-black/20 p-5">
                  <p className="text-sm text-gray-500">Sources found</p>

                  <p className="mt-2 text-3xl font-bold">
                    {result.news.length}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-black/20 p-5">
                  <p className="text-sm text-gray-500">Research status</p>

                  <p
                    className={`mt-2 text-lg font-semibold ${
                      result.evaluation.enough_information
                        ? "text-emerald-300"
                        : "text-amber-300"
                    }`}
                  >
                    {result.evaluation.enough_information
                      ? "Sufficient"
                      : "More research needed"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-black/20 p-5">
                  <p className="text-sm text-gray-500">Clarification</p>

                  <p
                    className={`mt-2 text-lg font-semibold ${
                      result.evaluation.needs_clarification
                        ? "text-amber-300"
                        : "text-gray-300"
                    }`}
                  >
                    {result.evaluation.needs_clarification
                      ? "Required"
                      : "Not required"}
                  </p>
                </div>
              </div>
            </section>

            {/* Search query */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  🔎
                </div>

                <div>
                  <h2 className="font-semibold">Search strategy</h2>

                  <p className="text-sm text-gray-500">
                    Query generated by the research agent
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                <code className="break-words text-sm leading-6 text-gray-300">
                  {result.search_query}
                </code>
              </div>
            </section>

            {/* Recent intelligence */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-lg">
                    📰
                  </div>

                  <div>
                    <h2 className="font-semibold">Recent intelligence</h2>

                    <p className="text-sm text-gray-500">
                      Information discovered during web research
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
                  {result.news.length} sources
                </span>
              </div>

              {result.news.length > 0 ? (
                <div className="space-y-4">
                  {result.news.map((item, index) => (
                    <article
                      key={index}
                      className="group rounded-xl border border-white/5 bg-black/20 p-5 transition hover:border-purple-500/20 hover:bg-white/[0.03]"
                    >
                      <div className="flex gap-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-sm font-semibold text-purple-300">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium leading-6 text-gray-100">
                            {item.title}
                          </h3>

                          {item.body && (
                            <p className="mt-2 line-clamp-4 text-sm leading-7 text-gray-400">
                              {item.body}
                            </p>
                          )}

                          {item.href && (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center text-sm font-medium text-purple-400 transition hover:text-purple-300 hover:underline"
                            >
                              Read source →
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-white/5 bg-black/20 p-5 text-sm text-gray-500">
                  No recent intelligence was found.
                </div>
              )}
            </section>

            {/* Research assessment */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-lg">
                  🧠
                </div>

                <div>
                  <h2 className="font-semibold">Research assessment</h2>

                  <p className="text-sm text-gray-500">
                    Structured evaluation of the collected information
                  </p>
                </div>
              </div>

              <div
                className={`rounded-xl border p-5 ${
                  result.evaluation.enough_information
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-amber-500/20 bg-amber-500/5"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                      result.evaluation.enough_information
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {result.evaluation.enough_information ? "✓" : "!"}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`font-semibold ${
                        result.evaluation.enough_information
                          ? "text-emerald-300"
                          : "text-amber-300"
                      }`}
                    >
                      {result.evaluation.enough_information
                        ? "Sufficient research collected"
                        : "Additional research may be needed"}
                    </p>

                    <p className="mt-2 text-sm leading-7 text-gray-400">
                      {result.evaluation.reasoning}
                    </p>
                  </div>
                </div>
              </div>

              {result.evaluation.missing_information?.length > 0 && (
                <div className="mt-5 rounded-xl border border-white/5 bg-black/20 p-5">
                  <p className="mb-3 text-sm font-medium text-gray-300">
                    Information still missing
                  </p>

                  <ul className="space-y-2">
                    {result.evaluation.missing_information.map(
                      (item, index) => (
                        <li
                          key={index}
                          className="flex gap-2 text-sm leading-6 text-gray-500"
                        >
                          <span className="text-amber-400">•</span>
                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </section>

            {/* Email workspace */}
            <section className="overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-500/[0.07] to-white/[0.03] shadow-xl shadow-blue-950/10">
              {/* Email header */}
              <div className="border-b border-white/10 p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                      ✉️
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-white">
                          Generated outreach email
                        </h2>

                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                          AI generated
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        Personalized using the company research collected by
                        the agent.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={copyEmail}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-200 transition hover:border-white/20 hover:bg-white/10"
                  >
                    {copied ? "✓ Copied to clipboard" : "Copy email"}
                  </button>
                </div>
              </div>

              {/* Email metadata */}
              <div className="grid border-b border-white/5 sm:grid-cols-2">
                <div className="border-b border-white/5 p-5 sm:border-b-0 sm:border-r">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-gray-600">
                    Purpose
                  </p>

                  <p className="mt-1.5 text-sm text-gray-300">
                    Internship outreach
                  </p>
                </div>

                <div className="p-5">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-gray-600">
                    Personalization
                  </p>

                  <p className="mt-1.5 text-sm text-gray-300">
                    Based on researched company intelligence
                  </p>
                </div>
              </div>

              {/* Email body */}
              <div className="p-6">
                <div className="rounded-2xl border border-white/5 bg-[#090d16] shadow-inner">
                  <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
                    <span className="text-xs font-medium text-gray-500">
                      Email preview
                    </span>

                    <span className="text-xs text-gray-600">
                      Ready to send
                    </span>
                  </div>

                  <div className="p-6 sm:p-8">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-gray-300">
                      {result.email}
                    </pre>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
                  <span>💡</span>

                  <span>
                    Review the email before sending and personalize any final
                    details if needed.
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && (
          <section className="mx-auto max-w-3xl py-10 text-center">
            <div className="mb-5 text-5xl">🤖</div>

            <h2 className="text-xl font-semibold text-gray-200">
              Ready to research
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Enter any company above and the agent will research it, evaluate
              the information, and prepare a personalized outreach email.
            </p>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-16 border-t border-white/5 pt-6 text-center text-xs text-gray-600">
          Company Research &amp; Outreach Agent · AI-powered research workflow
        </footer>
      </div>
    </main>
  );
}