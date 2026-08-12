"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

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
  reasoning: string;
};

type Result = ResearchResult | ClarificationResult;

/* =========================================================
   DESIGN SYSTEM
========================================================= */

const INK = "#070B14";
const PANEL = "#0D1320";
const PANEL_SOFT = "#101827";
const BORDER = "rgba(255,255,255,0.09)";
const BORDER_SOFT = "rgba(255,255,255,0.055)";

const TEXT = "#F4F7FB";
const MUTED = "#8D98AA";
const FAINT = "#596579";

const BLUE = "#5B8CFF";
const CYAN = "#55D6FF";
const PURPLE = "#A78BFA";
const GREEN = "#4ADE80";
const AMBER = "#FBBF24";
const RED = "#FB7185";

const DISPLAY_FONT =
  '"Fraunces", "Iowan Old Style", "Palatino Linotype", Georgia, serif';

const MONO_FONT =
  '"JetBrains Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

const PROCESSING_PHRASES = [
  "Opening research workspace...",
  "Identifying target organization...",
  "Generating search strategy...",
  "Cross-referencing company sources...",
  "Analyzing recent intelligence...",
  "Evaluating research completeness...",
  "Preparing personalized correspondence...",
];

/* =========================================================
   SMALL UI COMPONENTS
========================================================= */

function SectionHeader({
  number,
  title,
  description,
  icon,
  accent = BLUE,
}: {
  number: string;
  title: string;
  description: string;
  icon: string;
  accent?: string;
}) {
  return (
    <div className="mb-7 flex items-start gap-4">
      <div
        style={{
          borderColor: `${accent}30`,
          background: `${accent}12`,
          color: accent,
        }}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-lg"
      >
        {icon}
      </div>

      <div className="min-w-0">
        <div
          style={{
            fontFamily: MONO_FONT,
            color: accent,
          }}
          className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em]"
        >
          Exhibit {number}
        </div>

        <h2 className="font-semibold text-white">{title}</h2>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({
  label,
  tone = "blue",
}: {
  label: string;
  tone?: "blue" | "green" | "amber" | "red";
}) {
  const colors = {
    blue: BLUE,
    green: GREEN,
    amber: AMBER,
    red: RED,
  };

  const color = colors[tone];

  return (
    <span
      style={{
        borderColor: `${color}35`,
        background: `${color}10`,
        color,
      }}
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em]"
    >
      <span
        style={{ background: color }}
        className="h-1.5 w-1.5 rounded-full"
      />

      {label}
    </span>
  );
}

function StatCard({
  label,
  value,
  description,
  accent = BLUE,
}: {
  label: string;
  value: string;
  description?: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: PANEL_SOFT,
        borderColor: BORDER,
      }}
      className="rounded-2xl border p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/15"
    >
      <p
        style={{
          fontFamily: MONO_FONT,
          color: FAINT,
        }}
        className="text-[10px] font-semibold uppercase tracking-[0.16em]"
      >
        {label}
      </p>

      <p
        style={{
          color: accent,
          fontFamily: DISPLAY_FONT,
        }}
        className="mt-3 text-3xl leading-none"
      >
        {value}
      </p>

      {description && (
        <p className="mt-2 text-xs leading-5 text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
}

function Timeline({
  workflow,
}: {
  workflow: ResearchWorkflow;
}) {
  const steps = [
    {
      title: "Company identified",
      description:
        "Target organization was successfully identified.",
      done: workflow.company_identified,
    },
    {
      title: "Search strategy generated",
      description:
        "The agent generated a targeted research query.",
      done: workflow.search_strategy_generated,
    },
    {
      title: "Company information researched",
      description:
        "Company intelligence and recent information were gathered.",
      done: workflow.research_completed,
    },
    {
      title: "Research quality evaluated",
      description:
        "The agent evaluated whether enough information was available.",
      done: workflow.research_evaluated,
    },
    {
      title: "Follow-up research",
      description: workflow.follow_up_research
        ? `Additional research was performed (${workflow.retry_count} ${
            workflow.retry_count === 1 ? "follow-up search" : "follow-up searches"
          }).`
        : "Initial research was sufficient; no follow-up was required.",
      done: workflow.follow_up_research,
      optional: true,
    },
    {
      title: "Personalized email generated",
      description:
        "The final outreach email was generated from the research findings.",
      done: workflow.email_generated,
    },
  ];

  return (
    <div className="relative">
      <div
        style={{ background: BORDER }}
        className="absolute bottom-5 left-[19px] top-5 w-px"
      />

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="relative flex items-start gap-4"
          >
            <div
              style={{
                borderColor: step.done ? `${GREEN}50` : BORDER,
                background: step.done ? `${GREEN}10` : PANEL_SOFT,
                color: step.done ? GREEN : FAINT,
              }}
              className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
            >
              {step.done ? "✓" : index + 1}
            </div>

            <div
              style={{
                background: PANEL_SOFT,
                borderColor: step.done
                  ? `${GREEN}15`
                  : BORDER_SOFT,
              }}
              className="min-w-0 flex-1 rounded-xl border px-4 py-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-200">
                  {step.title}
                </p>

                {step.done && (
                  <span
                    style={{
                      fontFamily: MONO_FONT,
                      color: GREEN,
                    }}
                    className="text-[9px] font-bold uppercase tracking-[0.15em]"
                  >
                    Complete
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SourceItem({
  item,
  index,
  accent,
  label,
}: {
  item: ResearchItem | NewsItem;
  index: number;
  accent: string;
  label: string;
}) {
  return (
    <article
      style={{
        background: PANEL_SOFT,
        borderColor: BORDER_SOFT,
      }}
      className="group rounded-xl border p-5 transition duration-300 hover:border-white/15 hover:bg-white/[0.035]"
    >
      <div className="flex gap-4">
        <div
          style={{
            background: `${accent}12`,
            color: accent,
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              style={{
                fontFamily: MONO_FONT,
                color: FAINT,
              }}
              className="text-[9px] font-semibold uppercase tracking-[0.15em]"
            >
              {label}
            </span>
          </div>

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
              style={{ color: accent }}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold transition hover:opacity-80 hover:underline"
            >
              Open source
              <span>↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Home() {
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);

  /* Rotating loading status */

  useEffect(() => {
    if (!loading) {
      setPhraseIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setPhraseIndex(
        (current) => (current + 1) % PROCESSING_PHRASES.length
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [loading]);

  /* Deterministic case number */

  const caseNumber = useMemo(() => {
    if (result?.status !== "success") {
      return null;
    }

    let hash = 0;

    for (const character of result.company) {
      hash =
        (hash * 31 + character.charCodeAt(0)) >>> 0;
    }

    return String(hash % 10000).padStart(4, "0");
  }, [result]);

  /* =========================================================
     RESEARCH REQUEST
  ========================================================= */

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
    let response: Response;

    try {
      response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: company.trim(),
        }),
      });
    } catch {
      throw new Error(
        "The research backend is unavailable. Please make sure the backend is running and try again."
      );
    }

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
        errorData.detail ||
          `Research failed with status ${response.status}. Please try again.`
      );
    }

    if (!data || typeof data !== "object") {
      throw new Error(
        "The backend returned an empty or invalid research result."
      );
    }

    if (
      !("status" in data) ||
      (data.status !== "success" &&
        data.status !== "clarification_required")
    ) {
      throw new Error(
        "The backend returned an unexpected research result."
      );
    }

    setResult(data as Result);
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Something went wrong while researching the company."
    );
  } finally {
    setLoading(false);
  }
}
  /* =========================================================
     COPY EMAIL
  ========================================================= */

  async function copyEmail() {
    if (
      !result ||
      result.status !== "success" ||
      !result.email
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result.email);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError(
        "Could not copy the email to your clipboard."
      );
    }
  }

  return (
    <main
      style={{
        background: INK,
        color: TEXT,
      }}
      className="min-h-screen overflow-x-hidden"
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          style={{
            background: `radial-gradient(circle, ${BLUE}18 0%, transparent 68%)`,
          }}
          className="absolute left-1/2 top-[-300px] h-[650px] w-[850px] -translate-x-1/2 blur-3xl"
        />

        <div
          style={{
            background: `radial-gradient(circle, ${PURPLE}10 0%, transparent 70%)`,
          }}
          className="absolute bottom-[-250px] left-[-150px] h-[500px] w-[500px] blur-3xl"
        />

        <div
          style={{
            background: `radial-gradient(circle, ${CYAN}08 0%, transparent 70%)`,
          }}
          className="absolute right-[-200px] top-[40%] h-[450px] w-[450px] blur-3xl"
        />
      </div>

      {/* =====================================================
          PAGE CONTAINER
      ===================================================== */}

      <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="mb-14">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <div
              style={{
                borderColor: `${BLUE}30`,
                background: `${BLUE}0D`,
                color: "#9BB7FF",
              }}
              className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em]"
            >
              <span
                style={{ background: GREEN }}
                className="h-1.5 w-1.5 rounded-full"
              />

              Research Agent Online
            </div>

            <span
              style={{
                fontFamily: MONO_FONT,
                color: FAINT,
              }}
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Automated Intelligence · Rev. 03
            </span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <h1
                style={{
                  fontFamily: DISPLAY_FONT,
                }}
                className="text-5xl leading-[1.04] tracking-tight sm:text-7xl"
              >
                Company
                <br />
                Research
                <br />
                <span
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${BLUE}, ${CYAN})`,
                  }}
                  className="bg-clip-text text-transparent"
                >
                  &amp; Outreach.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
                An agentic research workflow that identifies a company,
                generates a search strategy, gathers intelligence,
                evaluates research quality, performs follow-up research
                when necessary, and produces a personalized outreach email.
              </p>
            </div>

            <div
              style={{
                borderColor: BORDER,
                background: PANEL,
              }}
              className="hidden rounded-2xl border p-5 lg:block"
            >
              <p
                style={{
                  fontFamily: MONO_FONT,
                  color: FAINT,
                }}
                className="text-[10px] font-semibold uppercase tracking-[0.16em]"
              >
                Agent capabilities
              </p>

              <div className="mt-4 space-y-3 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Company identification</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>

                <div className="flex justify-between">
                  <span>Web research</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>

                <div className="flex justify-between">
                  <span>Research evaluation</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>

                <div className="flex justify-between">
                  <span>Personalized outreach</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ===================================================
            SEARCH / INTAKE
        =================================================== */}

        <section className="mx-auto mb-10 max-w-4xl">
          <div
            style={{
              background: PANEL,
              borderColor: BORDER,
            }}
            className="rounded-2xl border p-2 shadow-2xl shadow-black/30"
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <span
                  style={{
                    fontFamily: MONO_FONT,
                    color: FAINT,
                  }}
                  className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xs"
                >
                  TARGET /
                </span>

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
                    if (
                      event.key === "Enter" &&
                      !loading
                    ) {
                      handleResearch();
                    }
                  }}
                  placeholder="Enter company name or website..."
                  className="w-full rounded-xl border border-transparent bg-transparent py-4 pl-[78px] pr-5 text-base text-white outline-none placeholder:text-gray-600 focus:border-white/10"
                />
              </div>

              <button
                type="button"
                onClick={handleResearch}
                disabled={loading}
                style={{
                  background: loading
                    ? `${BLUE}15`
                    : BLUE,
                  color: loading
                    ? "#9BB7FF"
                    : "#FFFFFF",
                }}
                className="rounded-xl px-7 py-4 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Researching..."
                  : "Open Research File →"}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                borderColor: `${RED}35`,
                background: `${RED}0D`,
                color: "#FDA4AF",
              }}
              className="mt-4 rounded-xl border px-5 py-4 text-sm"
            >
              <div className="flex items-start gap-3">
                <span>!</span>
                <span>{error}</span>
              </div>
            </div>
          )}
        </section>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <section
            style={{
              background: PANEL,
              borderColor: `${BLUE}30`,
            }}
            className="mx-auto mb-10 max-w-4xl overflow-hidden rounded-2xl border"
          >
            <div className="relative h-[2px] overflow-hidden bg-white/5">
              <div
                style={{
                  background: `linear-gradient(90deg, transparent, ${BLUE}, ${CYAN}, transparent)`,
                }}
                className="absolute h-full w-1/3 animate-[scan_1.3s_ease-in-out_infinite]"
              />
            </div>

            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div
                  style={{
                    borderColor: `${BLUE}30`,
                  }}
                  className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border"
                >
                  <div
                    style={{
                      borderColor: `${BLUE}25`,
                      borderTopColor: CYAN,
                    }}
                    className="absolute inset-1 animate-spin rounded-full border-2"
                  />

                  <span className="text-xs">✦</span>
                </div>

                <div>
                  <p
                    style={{
                      fontFamily: MONO_FONT,
                      color: CYAN,
                    }}
                    className="text-xs font-semibold uppercase tracking-[0.14em]"
                  >
                    {PROCESSING_PHRASES[phraseIndex]}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Target: {company.trim()}
                  </p>
                </div>
              </div>

              <div
                style={{
                  fontFamily: MONO_FONT,
                  color: FAINT,
                }}
                className="text-[10px] uppercase tracking-[0.15em]"
              >
                Agent execution in progress
              </div>
            </div>
          </section>
        )}

        {/* ===================================================
            CLARIFICATION
        =================================================== */}

        {result?.status === "clarification_required" && (
          <section
            style={{
              background: PANEL,
              borderColor: `${AMBER}30`,
            }}
            className="mx-auto max-w-4xl rounded-2xl border p-7 sm:p-8"
          >
            <div className="flex items-start gap-4">
              <div
                style={{
                  background: `${AMBER}12`,
                  color: AMBER,
                }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg"
              >
                !
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold text-white">
                    Identification required
                  </h2>

                  <StatusBadge
                    label="Needs clarification"
                    tone="amber"
                  />
                </div>

                <p className="mt-3 text-sm leading-7 text-gray-400">
                  {result.message}
                </p>
                
                {result.reasoning && (
                  <div
                    style={{
                      background: PANEL_SOFT,
                      borderColor: BORDER_SOFT,
                    }}
                    className="mt-5 rounded-xl border p-4"
                  >
                    <p
                      style={{
                        fontFamily: MONO_FONT,
                        color: FAINT,
                      }}
                      className="text-[10px] font-semibold uppercase tracking-[0.15em]"
                    >
                      Why clarification is needed
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-400">
                      {result.reasoning}
                    </p>
                  </div>
                )}

                <div
                  style={{
                    borderColor: BORDER_SOFT,
                    background: PANEL_SOFT,
                  }}
                  className="mt-5 rounded-xl border p-4"
                >
                  <p
                    style={{
                      fontFamily: MONO_FONT,
                      color: FAINT,
                    }}
                    className="text-[10px] uppercase tracking-[0.15em]"
                  >
                    Recommended input
                  </p>

                  <p className="mt-2 text-sm text-gray-400">
                    Try the company&apos;s full legal name,
                    official website, or another identifying detail.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===================================================
            SUCCESS RESULT
        =================================================== */}

        {result?.status === "success" && (
          <div className="space-y-6">

            {/* ===============================================
                CASE HEADER
            =============================================== */}

            <section
              style={{
                background: PANEL,
                borderColor: BORDER,
              }}
              className="rounded-2xl border p-7 sm:p-8"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div
                    style={{
                      fontFamily: MONO_FONT,
                      color: FAINT,
                    }}
                    className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                  >
                    Research case #{caseNumber}
                  </div>

                  <h2
                    style={{
                      fontFamily: DISPLAY_FONT,
                    }}
                    className="mt-2 break-words text-4xl leading-tight text-white sm:text-5xl"
                  >
                    {result.company}
                  </h2>

                  <p className="mt-3 text-sm text-gray-500">
                    Intelligence dossier generated by the research agent.
                  </p>
                </div>

                <StatusBadge
                  label="File complete"
                  tone="green"
                />
              </div>
            </section>

            {/* ===============================================
                SNAPSHOT
            =============================================== */}

            <section className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Sources found"
                value={String(result.news.length)}
                description="Recent intelligence sources"
                accent={CYAN}
              />

              <StatCard
                label="Research status"
                value={
                  result.evaluation.enough_information
                    ? "Ready"
                    : "Partial"
                }
                description={
                  result.evaluation.enough_information
                    ? "Enough information collected"
                    : "Additional information may help"
                }
                accent={
                  result.evaluation.enough_information
                    ? GREEN
                    : AMBER
                }
              />

              <StatCard
                label="Follow-up"
                value={
                  result.workflow.follow_up_research
                    ? `${result.workflow.retry_count}x`
                    : "None"
                }
                description={
                  result.workflow.follow_up_research
                    ? "Additional research performed"
                    : "Initial research was sufficient"
                }
                accent={PURPLE}
              />
            </section>

            {/* ===============================================
                EXHIBIT A — COMPANY INTELLIGENCE
            =============================================== */}

            <section
              style={{
                background: PANEL,
                borderColor: BORDER,
              }}
              className="rounded-2xl border p-6 sm:p-8"
            >
              <SectionHeader
                number="A"
                title="Company intelligence"
                description="Information gathered about the target organization."
                icon="◈"
                accent={CYAN}
              />

              {result.overview?.length > 0 ? (
                <div className="space-y-3">
                  {result.overview.map((item, index) => (
                    <SourceItem
                      key={index}
                      item={item}
                      index={index}
                      accent={CYAN}
                      label="Company intelligence"
                    />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    background: PANEL_SOFT,
                    borderColor: BORDER_SOFT,
                  }}
                  className="rounded-xl border p-5 text-sm text-gray-500"
                >
                  No company overview information was available.
                </div>
              )}
            </section>

            {/* ===============================================
                EXHIBIT B — AGENT WORKFLOW
            =============================================== */}

            <section
              style={{
                background: PANEL,
                borderColor: BORDER,
              }}
              className="rounded-2xl border p-6 sm:p-8"
            >
              <SectionHeader
                number="B"
                title="Agent workflow"
                description="How the autonomous research process reached the final result."
                icon="✦"
                accent={PURPLE}
              />

              <Timeline workflow={result.workflow} />
            </section>

            {/* ===============================================
                EXHIBIT C — SEARCH STRATEGY
            =============================================== */}

            <section
              style={{
                background: PANEL,
                borderColor: BORDER,
              }}
              className="rounded-2xl border p-6 sm:p-8"
            >
              <SectionHeader
                number="C"
                title="Search strategy"
                description="The targeted query generated by the research agent."
                icon="⌕"
                accent={BLUE}
              />

              <div
                style={{
                  background: "#080D17",
                  borderColor: BORDER_SOFT,
                }}
                className="rounded-xl border p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: MONO_FONT,
                      color: FAINT,
                    }}
                    className="text-[9px] uppercase tracking-[0.16em]"
                  >
                    Generated query
                  </span>

                  <span
                    style={{
                      fontFamily: MONO_FONT,
                      color: GREEN,
                    }}
                    className="text-[9px] uppercase tracking-[0.16em]"
                  >
                    Agent artifact
                  </span>
                </div>

                <code
                  style={{
                    fontFamily: MONO_FONT,
                    color: "#B8C7E8",
                  }}
                  className="block break-words text-sm leading-7"
                >
                  $ {result.search_query}
                </code>
              </div>
            </section>

            {/* ===============================================
                EXHIBIT D — RECENT INTELLIGENCE
            =============================================== */}

            <section
              style={{
                background: PANEL,
                borderColor: BORDER,
              }}
              className="rounded-2xl border p-6 sm:p-8"
            >
              <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
                <SectionHeader
                  number="D"
                  title="Recent intelligence"
                  description="Information discovered during web research."
                  icon="◉"
                  accent={PURPLE}
                />

                <span
                  style={{
                    fontFamily: MONO_FONT,
                    color: PURPLE,
                    background: `${PURPLE}10`,
                    borderColor: `${PURPLE}25`,
                  }}
                  className="rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
                >
                  {result.news.length} source
                  {result.news.length === 1 ? "" : "s"}
                </span>
              </div>

              {result.news.length > 0 ? (
                <div className="space-y-3">
                  {result.news.map((item, index) => (
                    <SourceItem
                      key={index}
                      item={item}
                      index={index}
                      accent={PURPLE}
                      label="Recent intelligence"
                    />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    background: PANEL_SOFT,
                    borderColor: BORDER_SOFT,
                  }}
                  className="rounded-xl border p-5 text-sm text-gray-500"
                >
                  No recent intelligence was found.
                </div>
              )}
            </section>

            {/* ===============================================
                EXHIBIT E — ASSESSMENT
            =============================================== */}

            <section
              style={{
                background: PANEL,
                borderColor: BORDER,
              }}
              className="rounded-2xl border p-6 sm:p-8"
            >
              <SectionHeader
                number="E"
                title="Analyst assessment"
                description="Structured evaluation of the research collected by the agent."
                icon="◎"
                accent={AMBER}
              />

              <div
                style={{
                  borderColor: result.evaluation.enough_information
                    ? `${GREEN}25`
                    : `${AMBER}25`,
                  background: result.evaluation.enough_information
                    ? `${GREEN}08`
                    : `${AMBER}08`,
                }}
                className="rounded-xl border p-5"
              >
                <div className="flex items-start gap-4">
                  <div
                    style={{
                      background: result.evaluation.enough_information
                        ? `${GREEN}12`
                        : `${AMBER}12`,
                      color: result.evaluation.enough_information
                        ? GREEN
                        : AMBER,
                    }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  >
                    {result.evaluation.enough_information
                      ? "✓"
                      : "!"}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
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

                      <StatusBadge
                        label={
                          result.evaluation.needs_clarification
                            ? "Clarification flagged"
                            : "Clear"
                        }
                        tone={
                          result.evaluation.needs_clarification
                            ? "amber"
                            : "green"
                        }
                      />
                    </div>

                    <p className="mt-3 text-sm leading-7 text-gray-400">
                      {result.evaluation.reasoning}
                    </p>
                  </div>
                </div>
              </div>

              {result.evaluation.missing_information?.length > 0 && (
                <div
                  style={{
                    background: PANEL_SOFT,
                    borderColor: BORDER_SOFT,
                  }}
                  className="mt-4 rounded-xl border p-5"
                >
                  <p
                    style={{
                      fontFamily: MONO_FONT,
                      color: FAINT,
                    }}
                    className="text-[10px] font-semibold uppercase tracking-[0.16em]"
                  >
                    Outstanding information
                  </p>

                  <ul className="mt-3 space-y-2">
                    {result.evaluation.missing_information.map(
                      (item, index) => (
                        <li
                          key={index}
                          className="flex gap-3 text-sm leading-6 text-gray-400"
                        >
                          <span
                            style={{ color: AMBER }}
                            className="mt-0.5"
                          >
                            →
                          </span>

                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </section>

            {/* ===============================================
                EXHIBIT F — EMAIL
            =============================================== */}

            <section
              style={{
                background: PANEL,
                borderColor: `${BLUE}35`,
              }}
              className="overflow-hidden rounded-2xl border shadow-2xl shadow-blue-950/10"
            >
              <div
                style={{
                  borderColor: BORDER,
                  background: `linear-gradient(90deg, ${BLUE}0D, transparent)`,
                }}
                className="border-b p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      style={{
                        background: `${BLUE}12`,
                        color: CYAN,
                      }}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg"
                    >
                      @
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-white">
                          Draft correspondence
                        </h2>

                        <StatusBadge
                          label="AI generated"
                          tone="green"
                        />
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        Personalized using the intelligence gathered above.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={copyEmail}
                    style={{
                      borderColor: copied
                        ? `${GREEN}40`
                        : BORDER,
                      background: copied
                        ? `${GREEN}0D`
                        : "rgba(255,255,255,0.03)",
                      color: copied
                        ? GREEN
                        : TEXT,
                    }}
                    className="rounded-xl border px-4 py-2.5 text-xs font-semibold transition hover:border-white/20 hover:bg-white/5"
                  >
                    {copied
                      ? "✓ Copied to clipboard"
                      : "Copy email"}
                  </button>
                </div>
              </div>

              {/* Email metadata */}

              <div
                style={{
                  borderColor: BORDER_SOFT,
                }}
                className="grid border-b sm:grid-cols-2"
              >
                <div
                  style={{
                    borderColor: BORDER_SOFT,
                  }}
                  className="border-b p-5 sm:border-b-0 sm:border-r"
                >
                  <p
                    style={{
                      fontFamily: MONO_FONT,
                      color: FAINT,
                    }}
                    className="text-[9px] uppercase tracking-[0.16em]"
                  >
                    Purpose
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    Internship outreach
                  </p>
                </div>

                <div className="p-5">
                  <p
                    style={{
                      fontFamily: MONO_FONT,
                      color: FAINT,
                    }}
                    className="text-[9px] uppercase tracking-[0.16em]"
                  >
                    Personalization
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    Based on researched company intelligence
                  </p>
                </div>
              </div>

              {/* Email body */}

              <div className="p-6">
                <div
                  style={{
                    background: "#080D17",
                    borderColor: BORDER_SOFT,
                  }}
                  className="overflow-hidden rounded-xl border"
                >
                  <div
                    style={{
                      borderColor: BORDER_SOFT,
                    }}
                    className="flex items-center justify-between border-b px-5 py-3"
                  >
                    <span
                      style={{
                        fontFamily: MONO_FONT,
                        color: FAINT,
                      }}
                      className="text-[9px] uppercase tracking-[0.15em]"
                    >
                      Email preview
                    </span>

                    <span
                      style={{
                        color: GREEN,
                      }}
                      className="text-[10px] font-medium"
                    >
                      ● Ready to review
                    </span>
                  </div>

                  <div className="p-6 sm:p-8">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-gray-300">
                      {result.email}
                    </pre>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-gray-600">
                  <span>◆</span>

                  <span>
                    Review the generated correspondence before sending
                    and personalize any final details if needed.
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===================================================
            EMPTY STATE
        =================================================== */}

        {!result && !loading && (
          <section
            style={{
              borderColor: BORDER_SOFT,
              background: `${PANEL}60`,
            }}
            className="mx-auto max-w-4xl rounded-2xl border border-dashed px-6 py-16 text-center"
          >
            <div
              style={{
                borderColor: `${BLUE}20`,
                background: `${BLUE}08`,
                color: CYAN,
              }}
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border text-xl"
            >
              ✦
            </div>

            <p
              style={{
                fontFamily: MONO_FONT,
                color: FAINT,
              }}
              className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em]"
            >
              Research workspace ready
            </p>

            <h2
              style={{
                fontFamily: DISPLAY_FONT,
              }}
              className="mt-3 text-2xl text-gray-200"
            >
              Open a company research file.
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
              Enter a company above and the agent will identify the
              organization, research it, evaluate the evidence, and
              prepare personalized outreach.
            </p>
          </section>
        )}

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer
          style={{
            borderColor: BORDER_SOFT,
            fontFamily: MONO_FONT,
          }}
          className="mt-16 border-t pt-7 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-700"
        >
          Company Research &amp; Outreach Agent
          <span className="mx-2 text-gray-800">·</span>
          Autonomous Research Workflow
          <span className="mx-2 text-gray-800">·</span>
          Rev. 03
        </footer>
      </div>

      {/* =====================================================
          ANIMATION
      ===================================================== */}

      <style>{`
        @keyframes scan {
          0% {
            transform: translateX(-120%);
          }

          100% {
            transform: translateX(420%);
          }
        }
      `}</style>
    </main>
  );
}