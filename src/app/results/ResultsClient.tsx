"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { AnalysisResult, KeywordMatch, FillerHit } from "@/lib/engine";

function ScoreHero({ score, band, verdict }: {
  score: number;
  band: string;
  verdict: string;
}) {
  const bandColor =
    band === "strong" ? "#059669" :
    band === "moderate" ? "#D97706" : "#DC2626";
  const bandLabel =
    band === "strong" ? "Strong Match" :
    band === "moderate" ? "Moderate Match" : "Low Match";

  return (
    <div className="relative w-full overflow-hidden mb-8">
      {/* Background gradient bar — full height of hero, width = score % */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="h-full transition-all duration-1000 ease-out"
          style={{
            width: `${score}%`,
            background: score >= 70
              ? "linear-gradient(to right, rgba(220,38,38,0.06), rgba(217,119,6,0.06), rgba(5,150,105,0.12))"
              : score >= 40
              ? "linear-gradient(to right, rgba(220,38,38,0.06), rgba(217,119,6,0.10))"
              : "linear-gradient(to right, rgba(220,38,38,0.10), rgba(220,38,38,0.04))",
          }}
        />
      </div>

      {/* Thin score line at right edge of the bar */}
      <div
        className="absolute top-0 bottom-0 w-px transition-all duration-1000 ease-out"
        style={{
          left: `${score}%`,
          backgroundColor: bandColor,
          opacity: 0.3,
        }}
      />

      {/* Content */}
      <div className="flex flex-col items-center py-8 px-4 relative z-10">
        {/* <ScoreArc score={score} band={band} /> */}
        <div
    className="mt-2 text-4xl font-semibold"
    style={{ color: bandColor }}
  >
    {score}%
  </div>
        <p className="mt-1 text-xs font-medium" style={{ color: bandColor }}>
          {bandLabel}
        </p>
        <p className="mt-2 text-sm text-gray-500 text-center max-w-md">
          {verdict}
        </p>
      </div>
    </div>
  );
}

// ── Score Arc ─────────────────────────────────────────────────────────────────
function ScoreArc({ score, band }: { score: number; band: string }) {
  const radius = 54;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    band === "strong" ? "#059669" :
    band === "moderate" ? "#D97706" : "#DC2626";

  return (
    <svg width="140" height="80" viewBox="0 0 140 80">
      <path d="M 14 70 A 56 56 0 0 1 126 70" fill="none" stroke="#F3F4F6"
        strokeWidth="10" strokeLinecap="round" />
      <path d="M 14 70 A 56 56 0 0 1 126 70" fill="none" stroke={color}
        strokeWidth="10" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s ease" }} />
      <text x="70" y="62" textAnchor="middle" fontSize="26"
        fontWeight="700" fill={color}>{score}%</text>
    </svg>
  );
}

// ── Keyword Chips ─────────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  technical: "Technical", tool: "Tools",
  soft: "Soft Skills", general: "General",
};

// Preferred display order for categories
const CATEGORY_ORDER = ["tool", "technical", "general", "soft"];

function KeywordChips({ keywords, found }: {
  keywords: KeywordMatch[];
  found: boolean;
}) {
  if (keywords.length === 0) return null;

  // Group by category
  const grouped = new Map<string, KeywordMatch[]>();
  for (const kw of keywords) {
    const cat = kw.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(kw);
  }

  // Sort categories by preferred order
  const sortedCategories = CATEGORY_ORDER.filter(c => grouped.has(c));

  const chipStyle = found
    ? { bg: "#F0FDF4", text: "#166534", border: "#86EFAC" }
    : { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA" };

  return (
    <div className="space-y-3">
      {sortedCategories.map(cat => (
        <div key={cat}>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">
            {CATEGORY_LABELS[cat] ?? cat}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {grouped.get(cat)!.map(kw => (
              <span
                key={kw.term}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium"
                style={{
                  backgroundColor: chipStyle.bg,
                  color: chipStyle.text,
                  borderColor: chipStyle.border,
                }}
              >
                {found ? "✓" : "+"} {kw.term}
                <span className="opacity-50 font-normal">{kw.jdFrequency}×</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Filler Words with Click Popover ───────────────────────────────────────────
function FillerHighlight({ resumeText, fillers }: {
  resumeText: string;
  fillers: FillerHit[];
}) {
  const [activePopover, setActivePopover] = useState<{
    phrase: string;
    suggestion: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (fillers.length === 0) {
    return (
      <div className="p-4 bg-green-50 rounded-lg text-sm text-green-700 border border-green-100">
        No filler phrases detected — your resume language looks specific and action-oriented.
      </div>
    );
  }

  // Build position → filler map
  const highlights = new Map<number, { end: number; filler: FillerHit }>();
  for (const filler of fillers) {
    for (const pos of filler.positions) {
      highlights.set(pos, { end: pos + filler.phrase.length, filler });
    }
  }

  // Build rendered parts
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  const sortedPositions = Array.from(highlights.keys()).sort((a, b) => a - b);

  for (const start of sortedPositions) {
    const { end, filler } = highlights.get(start)!;
    if (start < cursor) continue;

    if (start > cursor) {
      parts.push(
        <span key={`t-${cursor}`} className="whitespace-pre-wrap">
          {resumeText.slice(cursor, start)}
        </span>
      );
    }

    parts.push(
      <span
        key={`h-${start}`}
        onClick={(e) => {
          e.stopPropagation();
          const rect = (e.target as HTMLElement).getBoundingClientRect();
          const containerRect = containerRef.current?.getBoundingClientRect();
          if (!containerRect) return;
          setActivePopover({
            phrase: filler.phrase,
            suggestion: filler.suggestion,
            count: filler.count,
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top,
          });
        }}
        className="bg-amber-100 text-amber-900 border-b-2 border-amber-400 cursor-pointer rounded-sm px-0.5 hover:bg-amber-200 transition-colors"
      >
        {resumeText.slice(start, end)}
      </span>
    );
    cursor = end;
  }

  if (cursor < resumeText.length) {
    parts.push(
      <span key="t-end" className="whitespace-pre-wrap">
        {resumeText.slice(cursor)}
      </span>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
          {fillers.reduce((s, f) => s + f.count, 0)} filler phrases detected
        </span>
        <span className="text-xs text-gray-400">
          Click highlighted text for suggestions
        </span>
      </div>

      {/* Resume text with highlights */}
      <div
        ref={containerRef}
        className="relative"
        onClick={() => setActivePopover(null)}
      >
        <div className="text-sm text-gray-700 leading-relaxed font-mono bg-gray-50 p-4 rounded-lg max-h-80 overflow-y-auto border border-gray-100">
          {parts}
        </div>

        {/* Inline popover */}
        {activePopover && (
          <div
            className="absolute z-10 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-3"
            style={{
              left: Math.min(
                Math.max(activePopover.x - 128, 0),
                // clamp so it doesn't overflow right edge
                (containerRef.current?.offsetWidth ?? 600) - 260
              ),
              top: activePopover.y - 110,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Arrow */}
            <div
              className="absolute w-2 h-2 bg-white border-b border-r border-gray-200 rotate-45"
              style={{
                bottom: -5,
                left: Math.min(
                  Math.max(activePopover.x - 128, 0) > 0
                    ? 124
                    : activePopover.x - 4,
                  250
                ),
              }}
            />
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className="text-xs font-mono font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                "{activePopover.phrase}"
              </span>
              <span className="text-[10px] text-gray-400 shrink-0">
                ×{activePopover.count}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {activePopover.suggestion}
            </p>
            <button
              onClick={() => setActivePopover(null)}
              className="mt-2 text-[10px] text-gray-400 hover:text-gray-600"
            >
              dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Action Plan Sidebar ───────────────────────────────────────────────────────
function ActionPlan({ result }: { result: AnalysisResult }) {
  const actions: {
    priority: number;
    text: string;
    type: "add" | "remove";
  }[] = [];

  result.gap.missing.slice(0, 3).forEach((k, i) => {
    actions.push({
      priority: i + 1,
      text: `Add "${k.term}" — ${k.jdFrequency}× in JD`,
      type: "add",
    });
  });

  result.fillers.slice(0, 2).forEach(f => {
    actions.push({
      priority: actions.length + 1,
      text: `Remove "${f.phrase}" — ${f.suggestion}`,
      type: "remove",
    });
  });

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-3">
        Action Plan
      </p>
      {actions.map((action, i) => (
        <div
          key={i}
          className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs ${
            action.type === "add"
              ? "bg-blue-50 border-blue-100 text-blue-800"
              : "bg-amber-50 border-amber-100 text-amber-800"
          }`}
        >
          <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold bg-white border ${
            action.type === "add" ? "border-blue-200 text-blue-600" : "border-amber-200 text-amber-600"
          }`}>
            {action.priority}
          </span>
          <span className="leading-relaxed">{action.text}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ResultsClient() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [activeTab, setActiveTab] = useState<"fillers" | "keywords">("keywords");
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("shortlisted_result");
    const resume = sessionStorage.getItem("shortlisted_resume");
    if (!stored || !resume) { router.replace("/analyze"); return; }
    try {
      setResult(JSON.parse(stored));
      setResumeText(resume);
    } catch {
      router.replace("/analyze");
    }
  }, [router]);

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-sm text-gray-400">Loading results...</div>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto">

      {/* Score hero with full-width gradient bar */}
      <ScoreHero
        score={result.score.score}
        band={result.score.band}
        verdict={result.score.verdict}
      />

      <div className="px-4 pb-12">
        {/* Back link */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/analyze")}
            className="text-xs text-blue-600 hover:underline"
          >
            ← Analyze another resume
          </button>
        </div>

        {/* Keyword chips — always visible, no tab */}
        <div className="mb-8 space-y-6">
          {/* Missing */}
          {result.gap.missing.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Missing Keywords
                </h2>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
                  {result.gap.missing.length}
                </span>
              </div>
              <KeywordChips keywords={result.gap.missing} found={false} />
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Found */}
          {result.gap.found.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Found in Resume
                </h2>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-600">
                  {result.gap.found.length}
                </span>
              </div>
              <KeywordChips keywords={result.gap.found} found={true} />
            </div>
          )}
        </div>

        {/* Bottom section — two column on desktop */}
        <div className="border-t border-gray-100 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8">

            {/* Left — single tab: Filler Words */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Filler Words
                </h2>
                {result.fillerCount > 0 && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600">
                    {result.fillerCount}
                  </span>
                )}
              </div>
              <FillerHighlight
                resumeText={resumeText}
                fillers={result.fillers}
              />
            </div>

            {/* Right — Action plan sidebar */}
            <div className="md:border-l md:border-gray-100 md:pl-8">
              <ActionPlan result={result} />
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}