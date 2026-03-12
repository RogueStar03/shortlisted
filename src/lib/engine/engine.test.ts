import { analyseResume } from "./index";

// Sample resume and JD for testing
const SAMPLE_RESUME = `
John Doe | john@email.com | Mumbai, India

EXPERIENCE
Software Developer — Acme Corp (2022–2024)
- Built REST endpoints using Node.js and Express
- Worked on PostgreSQL database design and queries
- Helped with deployment using Docker containers
- Responsible for frontend development using React
- Participated in agile ceremonies and sprint planning
- I am a hardworking team player with excellent communication skills

SKILLS
JavaScript, TypeScript, React, Node.js, PostgreSQL, Docker, Git

EDUCATION
B.E. Computer Engineering — Mumbai University (2022)
`;

const SAMPLE_JD = `
We are looking for a Backend Engineer with strong experience in:

Required Skills:
- Node.js and TypeScript (3+ years)
- REST API design and development
- PostgreSQL and Redis for data storage
- Docker and Kubernetes for containerisation
- CI/CD pipelines using Jenkins or GitHub Actions
- Microservices architecture experience
- AWS or GCP cloud platforms

Nice to have:
- GraphQL API experience
- Kafka or message queue experience
- Terraform for infrastructure as code

You will work in a collaborative agile team environment.
Strong problem solving and communication skills required.
`;

// ── Tests ────────────────────────────────────────────────────────────────────

const result = analyseResume(SAMPLE_RESUME, SAMPLE_JD);

console.log("\n════════════════════════════════════");
console.log("  SHORTLISTED — Engine Smoke Test");
console.log("════════════════════════════════════\n");

// Test 1 — Score
console.log("── Score ──");
console.log(`  Score:   ${result.score.score}%`);
console.log(`  Band:    ${result.score.band}`);
console.log(`  Verdict: ${result.score.verdict}`);
console.log();

// Test 2 — Missing keywords
console.log("── Missing Keywords (top 10) ──");
result.gap.missing.slice(0, 10).forEach((k, i) => {
  console.log(
    `  ${i + 1}. ${k.term.padEnd(20)} | JD freq: ${k.jdFrequency} | TF-IDF: ${k.tfidf.toFixed(4)} | ${k.category}`,
  );
});
console.log();

// Test 3 — Found keywords
console.log("── Found in Resume (top 10) ──");
result.gap.found.slice(0, 10).forEach((k, i) => {
  console.log(
    `  ${i + 1}. ${k.term.padEnd(20)} | JD freq: ${k.jdFrequency} | TF-IDF: ${k.tfidf.toFixed(4)} | ${k.category}`,
  );
});
console.log();

// Test 4 — Filler words
console.log("── Filler Words Detected ──");
if (result.fillers.length === 0) {
  console.log("  None detected");
} else {
  result.fillers.forEach((f) => {
    console.log(`  "${f.phrase}" — ${f.count}x — ${f.suggestion}`);
  });
}
console.log();

// Test 5 — Counts
console.log("── Summary ──");
console.log(`  Missing keywords:  ${result.missingCount}`);
console.log(`  Filler hits:       ${result.fillerCount}`);
console.log(
  `  Top 5 to add:      ${result.topMissing.map((k) => k.term).join(", ")}`,
);
console.log();

// Test 6 — Assertions (these will throw if logic is broken)
console.log("── Assertions ──");

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    console.error(`  ✗ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
};

assert(
  result.score.score >= 0 && result.score.score <= 100,
  "Score is between 0 and 100",
);
assert(
  ["poor", "moderate", "strong"].includes(result.score.band),
  "Band is valid value",
);
assert(result.gap.missing.length > 0, "Has missing keywords");
assert(result.gap.found.length > 0, "Has found keywords");
assert(result.fillers.length > 0, "Detected filler words");
assert(
  result.fillers.some((f) => f.phrase === "responsible for"),
  "Detected 'responsible for'",
);
assert(
  result.fillers.some((f) => f.phrase === "team player"),
  "Detected 'team player'",
);
assert(
  result.fillers.some((f) => f.phrase === "hardworking"),
  "Detected 'hardworking'",
);
assert(
  result.gap.missing.length + result.gap.found.length <= 30,
  "Total keywords <= 30",
);
assert(result.topMissing.length <= 5, "Top missing is max 5 items");

console.log("\n✅  All assertions passed — engine is working correctly.\n");
