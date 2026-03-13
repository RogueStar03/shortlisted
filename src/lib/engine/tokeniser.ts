// Abbreviation expansion — maps shorthand to full canonical term
const ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  ml: "machine learning",
  ai: "artificial intelligence",
  dl: "deep learning",
  nlp: "natural language processing",
  cv: "computer vision",
  oop: "object oriented programming",
  db: "database",
  api: "api",
  apis: "api",
  sdk: "sdk",
  ui: "ui",
  ux: "ux",
  css: "css",
  html: "html",
  sql: "sql",
  nosql: "nosql",
  k8s: "kubernetes",
  aws: "aws",
  gcp: "gcp",
  ci: "ci",
  cd: "cd",
  cicd: "ci cd",
  devops: "devops",
  qa: "qa",
  rest: "rest",
  graphql: "graphql",
  grpc: "grpc",
  os: "operating system",
  vm: "virtual machine",
  dsa: "data structures",
  algo: "algorithms",
  fe: "frontend",
  be: "backend",
  fs: "full stack",
  svc: "service",
  microsvc: "microservice",
  auth: "authentication",
  dbs: "database",
  svcmesh: "service mesh",
  services: "service",
  databases: "database",
  models: "model",
  systems: "system",
  iac: "infrastructure as code",
  tf: "terraform",
  eks: "aws eks",
  ecs: "aws ecs",
  lambda: "aws lambda",
  s3: "aws s3",
  next: "nextjs",
  nextjs: "next.js",
  reactjs: "react",
  vuejs: "vue",
  llm: "large language model",
  rag: "retrieval augmented generation",
  genai: "generative ai",
};

export function tokenise(text: string): string[] {
  const tokens: string[] = [];

  // Lowercase and split on whitespace first
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-\.\/\+\#]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  for (const word of words) {
    // Handle hyphenated compounds: full-stack → keep both joined and parts
    // but only push joined if it looks like a technical term (no spaces, short)
    if (word.includes("-")) {
      const parts = word.split("-").filter((p) => p.length > 1);
      const joined = parts.join("");
      // Only keep joined form if short enough to be a real tech term
      if (joined.length <= 12) {
        tokens.push(word, joined, ...parts);
      } else {
        // Long hyphenated phrases — just keep the parts
        tokens.push(...parts);
      }
      continue;
    }

    // Handle dot-separated: node.js -> [node.js, nodejs, node]
    if (word.includes(".") && !word.match(/^\d+\.\d+/)) {
      const joined = word.replace(/\./g, "");
      const parts = word.split(".");
      tokens.push(word, joined, ...parts.filter((p) => p.length > 1));
      continue;
    }

    // Handle C++ and C#
    if (word === "c++" || word === "c#") {
      tokens.push(word);
      continue;
    }

    tokens.push(word);
  }

  // Expand aliases and deduplicate within this token set
  const expanded: string[] = [];
  for (const token of tokens) {
    if (token === "c++" || token === "c#") {
      expanded.push(token);
      continue;
    }
    const clean = token.replace(/[^a-z0-9\s]/g, "").trim();
    if (!clean || clean.length < 2) continue;
    expanded.push(ALIASES[clean] ?? clean);
  }

  // At the end of tokenise(), before returning expanded:
  const ALLOW_ALPHANUM = new Set([
    "c++",
    "c#",
    "es6",
    "es2015",
    "h264",
    "oauth2",
  ]);

  const filtered = expanded.filter((token) => {
    // Reject tokens that are purely numeric
    if (/^\d+$/.test(token)) return false;
    // Reject tokens mixing letters+numbers unless explicitly allowed
    if (/[a-z]/.test(token) && /\d/.test(token) && !ALLOW_ALPHANUM.has(token))
      return false;
    // Reject very short tokens
    if (token.length < 2) return false;
    return true;
  });

  return filtered;
}
