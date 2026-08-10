"use client";

import { useState } from "react";

export default function Home() {
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  async function handleResearch() {
    if (!company.trim()) {
      setError("Please enter a company name.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: company.trim(),
        }),
      });

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

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
            AI-Powered Research Agent
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Company Research & Outreach Agent
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-gray-400">
            Research a company, evaluate the information, and generate a
            personalized internship outreach email.
          </p>
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <label
            htmlFor="company"
            className="mb-2 block text-sm font-medium"
          >
            Company name
          </label>

          <div className="flex gap-3">
            <input
              id="company"
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="e.g. Intel"
              className="flex-1 rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <button
              type="button"
              onClick={handleResearch}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Researching..." : "Research"}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>

        {result && (
          <div className="mt-10 space-y-6">

            {/* Search Query */}
            <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-3 text-xl font-semibold">
                🔎 Search Query
              </h2>

              <p className="text-gray-300">
                {result.search_query}
              </p>
            </section>

            {/* Latest News */}
            <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-4 text-xl font-semibold">
                📰 Latest News
              </h2>

              <div className="space-y-4">
                {result.news.map((item: any, index: number) => (
                  <article
                    key={index}
                    className="rounded-lg border border-gray-700 bg-gray-950 p-4"
                  >
                    <h3 className="font-medium">
                      {index + 1}. {item.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-400">
                      {item.body}
                    </p>

                    {item.href && (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-blue-400 hover:underline"
                      >
                        Read source →
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </section>

            {/* Research Evaluation */}
            <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-4 text-xl font-semibold">
                🧠 Research Evaluation
              </h2>

              <p className="text-gray-300">
                <strong>Enough information:</strong>{" "}
                {result.evaluation.enough_information ? "Yes" : "No"}
              </p>

              <p className="mt-3 text-gray-400">
                {result.evaluation.reasoning}
              </p>
            </section>

            {/* Generated Email */}
            <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-4 text-xl font-semibold">
                ✉️ Generated Outreach Email
              </h2>

              <pre className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
                {result.email}
              </pre>
            </section>

          </div>
        )}
      </div>
    </main>
  );
}