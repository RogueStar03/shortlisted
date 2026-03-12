import { KeywordMatch } from "./gapAnalyser";

export type ScoreBand = "poor" | "moderate" | "strong";

export interface ScoreResult {
  score: number; // 0–100
  band: ScoreBand;
  verdict: string; // One-line human readable result
  foundWeight: number; // Sum of TF-IDF for found keywords
  totalWeight: number; // Sum of TF-IDF for all JD keywords
}

// Category weight multipliers — technical and tools matter more than soft skills
const CATEGORY_WEIGHTS: Record<string, number> = {
  technical: 1.0, // Full weight
  tool: 1.0, // Full weight
  general: 0.5, // Half weight — words like "api", "backend", "engineer"
  soft: 0.3, // Low weight — "communication", "teamwork"
};

export function calculateScore(
  found: KeywordMatch[],
  missing: KeywordMatch[],
): ScoreResult {
  const weight = (k: KeywordMatch) =>
    k.tfidf * (CATEGORY_WEIGHTS[k.category] ?? 0.5);

  const foundWeight = found.reduce((sum, k) => sum + weight(k), 0);
  const totalWeight = [...found, ...missing].reduce(
    (sum, k) => sum + weight(k),
    0,
  );

  const score =
    totalWeight === 0 ? 0 : Math.round((foundWeight / totalWeight) * 100);

  let band: ScoreBand;
  let verdict: string;

  if (score >= 70) {
    band = "strong";
    verdict = `Strong match — ${missing.length} keyword${missing.length === 1 ? "" : "s"} missing. Check filler words and formatting.`;
  } else if (score >= 40) {
    band = "moderate";
    verdict = `Moderate match — add the ${Math.min(missing.length, 5)} missing keywords below to improve your score.`;
  } else {
    band = "poor";
    verdict = `Low match — ${missing.length} important keywords missing. Significant gaps to close before applying.`;
  }

  return { score, band, verdict, foundWeight, totalWeight };
}
