"use client";

import { SCORE_BANDS } from "@/lib/constants/colors";

type Band = keyof typeof SCORE_BANDS;

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
  const { color, label } = SCORE_BANDS[band];

  const gradientMap: Record<Band, string> = {
    strong:
      "linear-gradient(to right, rgba(220,38,38,0.06), rgba(217,119,6,0.06), rgba(5,150,105,0.12))",
    moderate:
      "linear-gradient(to right, rgba(220,38,38,0.06), rgba(217,119,6,0.10))",
    poor: "linear-gradient(to right, rgba(220,38,38,0.10), rgba(220,38,38,0.04))",
  };

  return (
    <div className="relative w-full overflow-hidden">
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
          <p className="mt-2 text-sm text-gray-500 max-w-md">{verdict}</p>
        )}
      </div>
    </div>
  );
}
