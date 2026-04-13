"use client";

import { getMatchColor } from "@/lib/utils/matchColor";

type Band = "strong" | "moderate" | "poor";

const BAND_LABELS: Record<Band, string> = {
  strong: "Strong Match",
  moderate: "Moderate Match",
  poor: "Weak Match",
};

const gradientMap: Record<Band, string> = {
  strong:
    "linear-gradient(to right, var(--sl-danger-bg), var(--sl-warning-bg), var(--sl-success-bg))",
  moderate:
    "linear-gradient(to right, var(--sl-danger-bg), var(--sl-warning-bg))",
  poor: "linear-gradient(to right, var(--sl-danger-bg), rgba(248,113,113,0.04))",
};

export default function ScoreBar({
  score,
  band,
  verdict,
  compact = false,
}: {
  score: number;
  band: Band;
  verdict?: string;
  compact?: boolean;
}) {
  const color = getMatchColor(score);
  const label = BAND_LABELS[band];

  return (
    <div
      className="relative w-full overflow-hidden"
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Resume Match Score"
    >
      <span className="sr-only">
        Score: {score}%, {label}
      </span>
      {/* Gradient fill */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="h-full transition-all duration-1000 ease-out"
          style={{ width: `${score}%`, background: gradientMap[band] }}
        />
      </div>
      {/* Score edge line */}
      <div
        className="absolute top-0 bottom-0 w-px transition-all duration-1000 ease-out"
        style={{ left: `${score}%`, backgroundColor: color, opacity: 0.3 }}
      />
      {/* Content */}
      <div
        className={`relative z-10 flex flex-col items-center text-center ${compact ? "py-4" : "py-8"} px-4`}
      >
        <div
          className={`font-semibold ${compact ? "text-2xl" : "text-4xl"}`}
          style={{ color }}
        >
          {score}%
        </div>
        <p className="mt-1 text-xs font-medium" style={{ color }}>
          {label}
        </p>
        {verdict && (
          <p className="mt-2 text-sm max-w-md" style={{ color: "var(--sl-text-muted)" }}>
            {verdict}
          </p>
        )}
      </div>
    </div>
  );
}
