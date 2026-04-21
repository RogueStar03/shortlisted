"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { AnalysisResult, KeywordMatch, FillerHit } from "@/lib/engine";
import ScoreRing from "@/components/ui/ScoreRing";

// ── Keyword Chips ─────────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  technical: "Technical",
  tool: "Tools",
  soft: "Soft Skills",
  general: "General",
};

const CATEGORY_ORDER = ["tool", "technical", "general", "soft"];

function KeywordChips({
  keywords,
  found,
}: {
  keywords: KeywordMatch[];
  found: boolean;
}) {
  if (keywords.length === 0) return null;

  const grouped = new Map<string, KeywordMatch[]>();
  for (const kw of keywords) {
    const cat = kw.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(kw);
  }

  const sortedCategories = CATEGORY_ORDER.filter((c) => grouped.has(c));

  const chipStyle: React.CSSProperties = found
    ? {
        background: "var(--sl-success-bg)",
        color: "var(--sl-success)",
        border: "1px solid var(--sl-success)",
      }
    : {
        background: "var(--sl-danger-bg)",
        color: "var(--sl-danger)",
        border: "1px solid var(--sl-danger)",
      };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sortedCategories.map((cat) => (
        <div key={cat}>
          <p style={{ fontSize: 10, fontWeight: 500, color: "var(--sl-text-dim)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
            {CATEGORY_LABELS[cat] ?? cat}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {grouped.get(cat)!.map((kw) => (
              <span
                key={kw.term}
                style={{
                  ...chipStyle,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontWeight: 500,
                }}
              >
                {found ? "✓" : "+"} {kw.term}
                <span style={{ opacity: 0.5, fontWeight: 400 }}>{kw.jdFrequency}×</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Filler Words with Click Popover ───────────────────────────────────────────
function FillerHighlight({
  resumeText,
  fillers,
}: {
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
      <div style={{ padding: 16, background: "var(--sl-success-bg)", borderRadius: "var(--sl-radius-lg)", fontSize: 13, color: "var(--sl-success)", border: "1px solid var(--sl-success)" }}>
        No filler phrases detected — your resume language looks specific and action-oriented.
      </div>
    );
  }

  const highlights = new Map<number, { end: number; filler: FillerHit }>();
  for (const filler of fillers) {
    for (const pos of filler.positions) {
      highlights.set(pos, { end: pos + filler.phrase.length, filler });
    }
  }

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
        </span>,
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
        style={{
          background: "var(--sl-warning-bg)",
          color: "var(--sl-warning)",
          borderBottom: "2px solid var(--sl-warning)",
          cursor: "pointer",
          borderRadius: 2,
          padding: "0 2px",
        }}
      >
        {resumeText.slice(start, end)}
      </span>,
    );
    cursor = end;
  }

  if (cursor < resumeText.length) {
    parts.push(
      <span key="t-end" className="whitespace-pre-wrap">
        {resumeText.slice(cursor)}
      </span>,
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: "var(--sl-warning)", background: "var(--sl-warning-bg)", padding: "4px 8px", borderRadius: 999 }}>
          {fillers.reduce((s, f) => s + f.count, 0)} filler phrases detected
        </span>
        <span style={{ fontSize: 11, color: "var(--sl-text-dim)" }}>Click highlighted text for suggestions</span>
      </div>

      {/* Resume text with highlights */}
      <div
        ref={containerRef}
        style={{ position: "relative" }}
        onClick={() => setActivePopover(null)}
      >
        <div style={{ fontSize: 12, color: "var(--sl-text-muted)", lineHeight: 1.6, fontFamily: "var(--font-mono, monospace)", background: "var(--sl-surface)", padding: 16, borderRadius: "var(--sl-radius-lg)", maxHeight: 320, overflowY: "auto", border: "1px solid var(--sl-border)" }}>
          {parts}
        </div>

        {/* Inline popover */}
        {activePopover && (
          // eslint-disable-next-line react-hooks/refs
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              width: 256,
              background: "var(--sl-card)",
              border: "1px solid var(--sl-border-light)",
              borderRadius: "var(--sl-radius-xl)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              padding: 12,
              left: Math.min(
                Math.max(activePopover.x - 128, 0),
                (containerRef.current?.offsetWidth ?? 600) - 260,
              ),
              top: activePopover.y - 110,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Arrow */}
            <div
              style={{
                position: "absolute",
                width: 8,
                height: 8,
                background: "var(--sl-card)",
                border: "1px solid var(--sl-border-light)",
                borderTop: "none",
                borderLeft: "none",
                transform: "rotate(45deg)",
                bottom: -5,
                left: Math.min(
                  Math.max(activePopover.x - 128, 0) > 0 ? 124 : activePopover.x - 4,
                  250,
                ),
              }}
            />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontFamily: "var(--font-mono, monospace)", fontWeight: 500, color: "var(--sl-warning)", background: "var(--sl-warning-bg)", padding: "2px 6px", borderRadius: "var(--sl-radius-xs)" }}>
                &quot;{activePopover.phrase}&quot;
              </span>
              <span style={{ fontSize: 10, color: "var(--sl-text-dim)", flexShrink: 0 }}>×{activePopover.count}</span>
            </div>
            <p style={{ fontSize: 11, color: "var(--sl-text-muted)", lineHeight: 1.5 }}>{activePopover.suggestion}</p>
            <button
              onClick={() => setActivePopover(null)}
              style={{ marginTop: 8, fontSize: 10, color: "var(--sl-text-dim)", background: "none", border: "none", cursor: "pointer" }}
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

  result.fillers.slice(0, 2).forEach((f) => {
    actions.push({
      priority: actions.length + 1,
      text: `Remove "${f.phrase}" — ${f.suggestion}`,
      type: "remove",
    });
  });

  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 500, color: "var(--sl-text-dim)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
        Action Plan
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {actions.map((action, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: 12,
              borderRadius: "var(--sl-radius-lg)",
              fontSize: 12,
              background: action.type === "add" ? "var(--sl-accent-glow)" : "var(--sl-warning-bg)",
              color: action.type === "add" ? "var(--sl-accent)" : "var(--sl-warning)",
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: 20,
                height: 20,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 600,
                background: "var(--sl-card)",
                color: action.type === "add" ? "var(--sl-accent)" : "var(--sl-warning)",
              }}
            >
              {action.priority}
            </span>
            <span style={{ lineHeight: 1.5 }}>{action.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ResultsClient() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [resumeText, setResumeText] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("shortlisted_result");
    const resume = sessionStorage.getItem("shortlisted_resume");
    if (!stored || !resume) {
      router.replace("/analyze");
      return;
    }
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult(JSON.parse(stored));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResumeText(resume);
    } catch {
      router.replace("/analyze");
    }
  }, [router]);

  if (!result) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div className="animate-pulse" style={{ fontSize: 13, color: "var(--sl-text-muted)" }}>
          Loading results...
        </div>
      </div>
    );
  }

  return (
    <main style={{ padding: "24px 24px 48px" }}>
      {/* Score hero */}
      <div style={{ display: "flex", alignItems: "center", gap: 24, background: "var(--sl-surface)", borderRadius: 14, padding: "20px 24px", marginBottom: 24 }}>
        <ScoreRing score={result.score.score} size={80} animateOnce />
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "var(--sl-text)", marginBottom: 4 }}>
            {result.score.band === "strong" ? "Strong Match" : result.score.band === "moderate" ? "Moderate Match" : "Weak Match"}
          </div>
          {result.score.verdict && (
            <p style={{ fontSize: 12, color: "var(--sl-text-muted)", lineHeight: 1.5 }}>{result.score.verdict}</p>
          )}
          <div style={{ fontSize: 12, color: "var(--sl-text-dim)", marginTop: 4 }}>
            {result.gap.found.length} matched · {result.gap.missing.length} missing
          </div>
        </div>
      </div>

      <div style={{ padding: "0 0 48px" }}>
        {/* Back link */}
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => router.push("/analyze")}
            style={{ fontSize: 12, color: "var(--sl-accent)", background: "none", border: "none", cursor: "pointer" }}
          >
            ← Analyze another resume
          </button>
        </div>

        {/* Keyword chips */}
        <div style={{ marginBottom: 32, display: "flex", flexDirection: "column", gap: 24 }}>
          {result.gap.missing.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <h2 style={{ fontSize: 11, fontWeight: 600, color: "var(--sl-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                  Missing Keywords
                </h2>
                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 999, background: "var(--sl-danger-bg)", color: "var(--sl-danger)" }}>
                  {result.gap.missing.length}
                </span>
              </div>
              <KeywordChips keywords={result.gap.missing} found={false} />
            </div>
          )}

          <div style={{ borderTop: "1px solid var(--sl-border)" }} />

          {result.gap.found.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <h2 style={{ fontSize: 11, fontWeight: 600, color: "var(--sl-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                  Found in Resume
                </h2>
                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 999, background: "var(--sl-success-bg)", color: "var(--sl-success)" }}>
                  {result.gap.found.length}
                </span>
              </div>
              <KeywordChips keywords={result.gap.found} found={true} />
            </div>
          )}
        </div>

        {/* Bottom section — two column */}
        <div style={{ borderTop: "1px solid var(--sl-border)", paddingTop: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 32 }}>
            {/* Left — Filler Words */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <h2 style={{ fontSize: 11, fontWeight: 600, color: "var(--sl-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                  Filler Words
                </h2>
                {result.fillerCount > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 999, background: "var(--sl-warning-bg)", color: "var(--sl-warning)" }}>
                    {result.fillerCount}
                  </span>
                )}
              </div>
              <FillerHighlight resumeText={resumeText} fillers={result.fillers} />
            </div>

            {/* Right — Action plan */}
            <div style={{ borderLeft: "1px solid var(--sl-border)", paddingLeft: 32 }}>
              <ActionPlan result={result} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
