"use client";

import { useState } from "react";

type NewsItem = {
title: string;
body: string;
href?: string;
};

type ResearchResult = {
company: string;
search_query: string;
news: NewsItem[];
evaluation: {
enough_information: boolean;
reasoning: string;
missing_information: string[];
};
email: string;
};

export default function Home() {
const [company, setCompany] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [result, setResult] = useState<ResearchResult | null>(null);
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Research failed.");
  }

  setResult(data);
} catch (error) {
  setError(
    error instanceof Error
      ? error.message
      : "Something went wrong."
  );
} finally {
  setLoading(false);
}

}

async function copyEmail() {
if (!result?.email) return;

await navigator.clipboard.writeText(result.email);
setCopied(true);

setTimeout(() => {
  setCopied(false);
}, 2000);

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
          & Outreach Agent
        </span>
      </h1>

      <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
        Research a company, analyze the latest information, and
        generate a personalized internship outreach email in seconds.
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
            onChange={(event) => setCompany(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !loading) {
                handleResearch();
              }
            }}
            placeholder="Enter a company name..."
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
          Gathering company information, analyzing recent news,
          and generating your outreach email.
        </p>
      </section>
    )}

    {/* Results */}
    {result && (
      <div className="space-y-6">

        {/* Company overview */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Research completed for
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                {result.company}
              </h2>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Research complete
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

        {/* News */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
                📰
              </div>

              <div>
                <h2 className="font-semibold">Latest intelligence</h2>
                <p className="text-sm text-gray-500">
                  Information discovered during research
                </p>
              </div>
            </div>

            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">
              {result.news.length} sources
            </span>
          </div>

          <div className="space-y-4">
            {result.news.map((item, index) => (
              <article
                key={index}
                className="group rounded-xl border border-white/5 bg-black/20 p-5 transition hover:border-white/10 hover:bg-white/[0.03]"
              >
                <div className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-sm font-semibold text-gray-500">
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <h3 className="font-medium leading-6 text-gray-100">
                      {item.title}
                    </h3>

                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-gray-400">
                      {item.body}
                    </p>

                    {item.href && (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-sm font-medium text-blue-400 transition hover:text-blue-300 hover:underline"
                      >
                        Read source →
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Evaluation */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
              🧠
            </div>

            <div>
              <h2 className="font-semibold">Research evaluation</h2>
              <p className="text-sm text-gray-500">
                Agent assessment of information quality
              </p>
            </div>
          </div>

          <div
            className={`mb-5 rounded-xl border p-4 ${
              result.evaluation.enough_information
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-amber-500/20 bg-amber-500/5"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                result.evaluation.enough_information
                  ? "text-emerald-300"
                  : "text-amber-300"
              }`}
            >
              {result.evaluation.enough_information
                ? "✓ Enough information collected"
                : "⚠ More information may be needed"}
            </p>
          </div>

          <p className="text-sm leading-7 text-gray-400">
            {result.evaluation.reasoning}
          </p>

          {result.evaluation.missing_information?.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-gray-300">
                Missing information
              </p>

              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-500">
                {result.evaluation.missing_information.map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </div>
          )}
        </section>

        {/* Email */}
        <section className="overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-500/[0.07] to-white/[0.03]">
          <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                ✉️
              </div>

              <div>
                <h2 className="font-semibold">
                  Generated outreach email
                </h2>
                <p className="text-sm text-gray-500">
                  Personalized using the research results
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={copyEmail}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
            >
              {copied ? "✓ Copied" : "Copy email"}
            </button>
          </div>

          <div className="p-6">
            <div className="rounded-xl border border-white/5 bg-[#090d16] p-6 shadow-inner">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-gray-300">
                {result.email}
              </pre>
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
          Enter any company above and the agent will research it,
          evaluate the information, and prepare a personalized
          outreach email.
        </p>
      </section>
    )}

    {/* Footer */}
    <footer className="mt-16 border-t border-white/5 pt-6 text-center text-xs text-gray-600">
      Company Research & Outreach Agent · AI-powered research workflow
    </footer>
    </div>
  </main>
);
}
