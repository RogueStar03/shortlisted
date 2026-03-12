export interface FillerHit {
  phrase: string; // The matched phrase
  count: number; // How many times it appears
  positions: number[]; // Character positions for UI highlighting
  suggestion: string; // What to do instead
}

// 60 curated resume clichés with replacement suggestions
const FILLER_PHRASES: Array<{ phrase: string; suggestion: string }> = [
  // Generic identity
  { phrase: "hardworking", suggestion: "Show it — quantify output instead" },
  {
    phrase: "passionate about",
    suggestion: "Replace with specific achievement in this area",
  },
  {
    phrase: "results-driven",
    suggestion: "State an actual result with numbers",
  },
  {
    phrase: "detail-oriented",
    suggestion: "Give an example where detail mattered",
  },
  { phrase: "self-starter", suggestion: "Describe something you initiated" },
  { phrase: "go-getter", suggestion: "Remove entirely — add a concrete win" },
  {
    phrase: "motivated individual",
    suggestion: "Remove — implied by applying",
  },
  {
    phrase: "highly motivated",
    suggestion: "Remove — add what you built instead",
  },
  {
    phrase: "quick learner",
    suggestion: "Name a technology you learned fast and used",
  },
  {
    phrase: "problem solver",
    suggestion: "Describe a specific problem you solved",
  },
  {
    phrase: "strategic thinker",
    suggestion: "Describe a strategic decision you made",
  },
  {
    phrase: "proven track record",
    suggestion: "State the actual track record with numbers",
  },
  {
    phrase: "excellent communication skills",
    suggestion: "Give a context where you communicated well",
  },
  {
    phrase: "multitasker",
    suggestion: "Remove — describe parallel workstreams instead",
  },
  {
    phrase: "deadline-driven",
    suggestion: "Remove — mention a specific delivery",
  },
  {
    phrase: "team-oriented",
    suggestion: "Mention team size and your role in it",
  },
  {
    phrase: "strong interpersonal skills",
    suggestion: "Remove — show don't tell",
  },
  {
    phrase: "natural leader",
    suggestion: "Mention a team you led and the outcome",
  },
  {
    phrase: "thought leader",
    suggestion: "Link to content or mention specific influence",
  },
  { phrase: "visionary", suggestion: "Remove entirely" },
  // Responsibility phrases
  {
    phrase: "responsible for",
    suggestion: "Start with a strong verb: Led, Built, Designed",
  },
  {
    phrase: "worked on",
    suggestion: "Be specific: Built X using Y, reducing Z by N%",
  },
  { phrase: "involved in", suggestion: "State your specific contribution" },
  {
    phrase: "helped with",
    suggestion: "Own it — what did you specifically do?",
  },
  {
    phrase: "assisted in",
    suggestion: "Own it — what did you specifically do?",
  },
  {
    phrase: "participated in",
    suggestion: "State your specific role and contribution",
  },
  {
    phrase: "tasked with",
    suggestion: "Start with what you delivered, not what you were given",
  },
  { phrase: "dealt with", suggestion: "Replace with specific action verb" },
  {
    phrase: "handled",
    suggestion: "Replace with what you built, fixed, or improved",
  },
  {
    phrase: "duties included",
    suggestion: "Start each bullet with an action verb",
  },
  {
    phrase: "responsibilities include",
    suggestion: "Start each bullet with an action verb",
  },
  { phrase: "exposure to", suggestion: "If you used it, say you used it" },
  {
    phrase: "familiar with",
    suggestion: "If you used it, say you used it. Otherwise remove.",
  },
  {
    phrase: "knowledge of",
    suggestion: "Replace with projects where you applied this",
  },
  {
    phrase: "worked closely with",
    suggestion: "Name the team/stakeholder and the outcome",
  },
  {
    phrase: "experience in the field of",
    suggestion: "State the specific experience directly",
  },
  {
    phrase: "track record of success",
    suggestion: "State the actual success metrics",
  },
  {
    phrase: "leveraged synergies",
    suggestion: "Remove — say what you actually did",
  },
  { phrase: "contributed to", suggestion: "State your specific contribution" },
  // Team and culture fluff
  {
    phrase: "team player",
    suggestion: "Mention team size and collaboration context",
  },
  {
    phrase: "cross-functional team",
    suggestion: "Name the teams and describe the outcome",
  },
  {
    phrase: "collaborative environment",
    suggestion: "Remove — describe the collaboration",
  },
  {
    phrase: "fast-paced environment",
    suggestion: "Remove — everyone says this",
  },
  {
    phrase: "strong work ethic",
    suggestion: "Remove — show it through output",
  },
  { phrase: "people person", suggestion: "Remove entirely" },
  {
    phrase: "dynamic team",
    suggestion: "Remove — describe the team's actual work",
  },
  {
    phrase: "synergy",
    suggestion: "Remove entirely — describe the actual collaboration",
  },
  { phrase: "wear many hats", suggestion: "List the actual responsibilities" },
  {
    phrase: "go above and beyond",
    suggestion: "Describe the specific instance",
  },
  {
    phrase: "think outside the box",
    suggestion: "Describe the creative solution you applied",
  },
  {
    phrase: "hit the ground running",
    suggestion: "Remove — describe your ramp-up speed with evidence",
  },
  {
    phrase: "passionate learner",
    suggestion: "Name what you learned and built with it",
  },
  {
    phrase: "eager to learn",
    suggestion: "Name what you recently taught yourself",
  },
  { phrase: "growth mindset", suggestion: "Remove — describe how you grew" },
  { phrase: "outside the box", suggestion: "Describe the creative solution" },
  { phrase: "value-add", suggestion: "State the actual value you added" },
  {
    phrase: "bandwidth",
    suggestion: "Replace with specific capacity or time framing",
  },
  { phrase: "circle back", suggestion: "Remove — use plain language" },
  {
    phrase: "deep dive",
    suggestion: "Replace with specific analysis you performed",
  },
  {
    phrase: "move the needle",
    suggestion: "State the actual metric that moved",
  },
];

export function detectFillers(resumeText: string): FillerHit[] {
  const lower = resumeText.toLowerCase();
  const hits: FillerHit[] = [];

  for (const { phrase, suggestion } of FILLER_PHRASES) {
    const positions: number[] = [];
    let searchFrom = 0;

    while (true) {
      const idx = lower.indexOf(phrase, searchFrom);
      if (idx === -1) break;
      positions.push(idx);
      searchFrom = idx + phrase.length;
    }

    if (positions.length > 0) {
      hits.push({
        phrase,
        count: positions.length,
        positions,
        suggestion,
      });
    }
  }

  // Sort by count descending — worst offenders first
  return hits.sort((a, b) => b.count - a.count);
}
