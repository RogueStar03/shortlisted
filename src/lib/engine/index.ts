import { analyseGap, GapAnalysis } from "./gapAnalyser";
import { detectFillers, FillerHit } from "./fillerDetector";
import { calculateScore, ScoreResult } from "./scorer";
import { ScoredKeyword } from "./tfidf";

export interface AnalysisResult {
  score: ScoreResult;
  gap: GapAnalysis;
  fillers: FillerHit[];
  // Convenience shortcuts for the UI
  missingCount: number;
  fillerCount: number;
  topMissing: GapAnalysis["missing"]; // Top 5 by TF-IDF
}

export function analyseResume(
  resumeText: string,
  jdText: string,
): AnalysisResult {
  if (!resumeText.trim() || !jdText.trim()) {
    throw new Error("Both resume and job description text are required.");
  }

  const gap = analyseGap(resumeText, jdText);
  const fillers = detectFillers(resumeText);
  const score = calculateScore(gap.found, gap.missing);

  return {
    score,
    gap,
    fillers,
    missingCount: gap.missing.length,
    fillerCount: fillers.reduce((sum, f) => sum + f.count, 0),
    topMissing: gap.missing.slice(0, 5),
  };
}

// Re-export types so the rest of the app only imports from this file
export type { GapAnalysis, FillerHit, ScoreResult, ScoredKeyword };
export type { KeywordMatch } from "./gapAnalyser";
export type { ScoreBand } from "./scorer";
