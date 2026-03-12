import STOPWORDS from "./stopwords";
import { tokenise } from "./tokeniser";
import { stem } from "./stemmer";

// Pre-computed IDF values based on a reference corpus of ~500 generic JDs
// Higher value = rarer term = more signal
// Terms not in this map get a default IDF of 1.0
const REFERENCE_IDF: Record<string, number> = {
  // Very high signal — rare but important when present
  kubernetes: 3.8,
  terraform: 3.7,
  elasticsearch: 3.6,
  graphql: 3.5,
  grpc: 3.4,
  kafka: 3.6,
  spark: 3.4,
  airflow: 3.7,
  dbt: 3.8,
  snowflake: 3.6,
  redis: 3.3,
  pytorch: 3.5,
  tensorflow: 3.4,
  opencv: 3.7,
  microservices: 3.2,
  serverless: 3.3,
  blockchain: 3.5,
  // High signal — common in specific roles
  docker: 2.8,
  aws: 2.6,
  gcp: 2.9,
  azure: 2.7,
  react: 2.4,
  angular: 2.6,
  vue: 2.7,
  nextjs: 2.5,
  nodejs: 2.3,
  django: 2.6,
  fastapi: 2.8,
  flask: 2.5,
  postgresql: 2.6,
  mongodb: 2.5,
  mysql: 2.4,
  typescript: 2.5,
  python: 2.2,
  javascript: 2.1,
  "machine learning": 2.7,
  "deep learning": 2.8,
  nlp: 3.0,
  "ci cd": 2.6,
  devops: 2.5,
  linux: 2.3,
  "rest api": 2.4,
  api: 1.8,
  sdk: 2.3,
  "system design": 2.8,
  "data structures": 2.5,
  algorithms: 2.4,
  git: 1.9,
  jenkins: 2.6,
  "github actions": 2.7,
  // Medium signal
  java: 1.9,
  golang: 2.6,
  rust: 3.0,
  scala: 2.8,
  spring: 2.3,
  hibernate: 2.5,
  junit: 2.6,
  redux: 2.4,
  tailwind: 2.5,
  webpack: 2.4,
  sql: 1.8,
  nosql: 2.4,
  database: 1.6,
  testing: 1.9,
  "unit testing": 2.3,
  "integration testing": 2.4,
  agile: 1.8,
  scrum: 2.0,
  jira: 2.0,
  // Lower signal — common across almost all JDs
  communication: 1.2,
  leadership: 1.3,
  teamwork: 1.1,
  "problem solving": 1.4,
  analytical: 1.5,
  collaboration: 1.2,
};

const DEFAULT_IDF = 1.0;

export interface ScoredKeyword {
  term: string;
  stemmed: string;
  rawTf: number; // How many times it appears in the JD
  tfidf: number; // TF × IDF score
  category: "technical" | "tool" | "soft" | "general";
}

// Categorisation vocabularies
const TECHNICAL_SKILLS = new Set([
  "javascript",
  "typescript",
  "python",
  "java",
  "golang",
  "rust",
  "scala",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "dart",
  "c++",
  "c#",
  "r",
  "matlab",
  "machine learning",
  "deep learning",
  "nlp",
  "computer vision",
  "data science",
  "algorithms",
  "data structures",
  "system design",
  "object oriented programming",
  "functional programming",
  "microservices",
  "serverless",
  "rest api",
  "graphql",
  "grpc",
  "websocket",
  "oauth",
  "jwt",
  "ci cd",
  "devops",
  "agile",
  "scrum",
  "tdd",
  "unit testing",
  "integration testing",
  "sql",
  "nosql",
]);

const TOOLS = new Set([
  "react",
  "angular",
  "vue",
  "nextjs",
  "svelte",
  "nodejs",
  "django",
  "fastapi",
  "flask",
  "spring",
  "express",
  "laravel",
  "rails",
  "pytorch",
  "tensorflow",
  "opencv",
  "docker",
  "kubernetes",
  "terraform",
  "ansible",
  "jenkins",
  "git",
  "github actions",
  "gitlab",
  "aws",
  "gcp",
  "azure",
  "postgresql",
  "mongodb",
  "mysql",
  "redis",
  "elasticsearch",
  "kafka",
  "spark",
  "airflow",
  "dbt",
  "snowflake",
  "tableau",
  "figma",
  "jira",
  "confluence",
  "postman",
  "webpack",
  "vite",
  "tailwind",
  "redux",
  "graphql",
]);

const SOFT_SKILLS = new Set([
  "communication",
  "leadership",
  "teamwork",
  "collaboration",
  "problem solving",
  "analytical",
  "mentoring",
  "presentation",
  "stakeholder",
  "cross functional",
  "time management",
  "critical thinking",
  "adaptability",
  "ownership",
]);

function categorise(term: string): ScoredKeyword["category"] {
  if (SOFT_SKILLS.has(term)) return "soft";
  if (TOOLS.has(term)) return "tool";
  if (TECHNICAL_SKILLS.has(term)) return "technical";
  return "general";
}

export function extractKeywords(text: string): ScoredKeyword[] {
  const tokens = tokenise(text).filter(
    (t) => !STOPWORDS.has(t) && t.length > 1,
  );
  const stemmed = tokens.map((t) => stem(t));

  // Count term frequency
  const tfMap = new Map<
    string,
    { stemmed: string; raw: string; count: number }
  >();

  for (let i = 0; i < stemmed.length; i++) {
    const s = stemmed[i];
    const r = tokens[i];
    if (!tfMap.has(s)) {
      tfMap.set(s, { stemmed: s, raw: r, count: 0 });
    }
    tfMap.get(s)!.count++;
  }

  const totalTokens = stemmed.length || 1;
  const results: ScoredKeyword[] = [];

  for (const [s, { raw, count }] of tfMap.entries()) {
    const tf = count / totalTokens;
    const idf = REFERENCE_IDF[raw] ?? REFERENCE_IDF[s] ?? DEFAULT_IDF;
    const tfidf = tf * idf;

    // Filter out very low signal terms
    if (tfidf < 0.001) continue;

    results.push({
      term: raw,
      stemmed: s,
      rawTf: count,
      tfidf,
      category: categorise(raw),
    });
  }

  // Sort by TF-IDF descending — most important terms first
  return results.sort((a, b) => b.tfidf - a.tfidf);
}
