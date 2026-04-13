"use client";

import { useEffect, useRef, useState } from "react";
import { getMatchColor } from "@/lib/utils/matchColor";

interface ScoreRingProps {
  score: number;
  size: number;
  animateOnce?: boolean;
}

export default function ScoreRing({ score, size, animateOnce = false }: ScoreRingProps) {
  const r = size * 0.4;
  const circ = 2 * Math.PI * r;
  const strokeWidth = size * 0.08;
  const center = size / 2;
  const color = getMatchColor(score);

  const [val, setVal] = useState(animateOnce ? 0 : score);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!animateOnce) return;

    const start = performance.now();
    const duration = 1000;

    function tick(now: number) {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      // cubic ease-out
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * score));
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [animateOnce, score]);

  const offset = circ - (val / 100) * circ;
  const fontSize = Math.round(size * 0.28);

  return (
    <svg width={size} height={size} style={{ display: "block", flexShrink: 0 }}>
      {/* Track */}
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke="var(--sl-border)"
        strokeWidth={strokeWidth}
      />
      {/* Progress */}
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${center} ${center})`}
      />
      {/* Score label */}
      <text
        x={center}
        y={center + fontSize * 0.35}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight={600}
        fill={color}
        fontFamily="var(--font-mono, monospace)"
      >
        {val}
      </text>
    </svg>
  );
}
