// Lightweight suffix-stripping stemmer
// Not a full Porter Stemmer — covers the most common English suffixes
// which is sufficient for resume/JD keyword matching

function hasvowel(str: string): boolean {
  return /[aeiou]/.test(str);
}

function cvc(str: string): boolean {
  const len = str.length;
  if (len < 3) return false;
  const c = str[len - 1];
  const v = str[len - 2];
  const c2 = str[len - 3];
  const isC = (ch: string) => !/[aeiou]/.test(ch);
  const isV = (ch: string) => /[aeiou]/.test(ch);
  return isC(c2) && isV(v) && isC(c) && !["w", "x", "y"].includes(c);
}

export function stem(word: string): string {
  if (word.length <= 3) return word;

  // Handle known technical terms that should never be stemmed
  const NOSTEM = new Set([
    "javascript",
    "typescript",
    "python",
    "kubernetes",
    "elasticsearch",
    "postgresql",
    "mongodb",
    "redis",
    "docker",
    "jenkins",
    "terraform",
    "ansible",
    "graphql",
    "grpc",
    "restful",
    "microservices",
    "serverless",
    "machine learning",
    "deep learning",
    "css",
    "html",
    "sql",
    "nosql",
    "linux",
    "macos",
    "windows",
    "android",
    "ios",
    "aws",
    "gcp",
    "azure",
  ]);
  if (NOSTEM.has(word)) return word;

  let w = word;

  // Step 1a — plurals and past tense
  if (w.endsWith("sses")) w = w.slice(0, -2);
  else if (w.endsWith("ies")) w = w.slice(0, -2);
  else if (w.endsWith("ss")) w = w;
  else if (w.endsWith("s") && w.length > 4) w = w.slice(0, -1);

  // Step 1b — -ed, -ing
  if (w.endsWith("eed")) {
    if (w.length > 4) w = w.slice(0, -1);
  } else if (w.endsWith("ed") && hasvowel(w.slice(0, -2))) {
    w = w.slice(0, -2);
    if (w.endsWith("at") || w.endsWith("bl") || w.endsWith("iz")) w += "e";
    else if (
      w.length > 1 &&
      w[w.length - 1] === w[w.length - 2] &&
      !["l", "s", "z"].includes(w[w.length - 1])
    )
      w = w.slice(0, -1);
    else if (cvc(w)) w += "e";
  } else if (w.endsWith("ing") && hasvowel(w.slice(0, -3))) {
    w = w.slice(0, -3);
    if (w.endsWith("at") || w.endsWith("bl") || w.endsWith("iz")) w += "e";
    else if (
      w.length > 1 &&
      w[w.length - 1] === w[w.length - 2] &&
      !["l", "s", "z"].includes(w[w.length - 1])
    )
      w = w.slice(0, -1);
    else if (cvc(w)) w += "e";
  }

  // Step 2 — common suffixes
  const step2: [string, string][] = [
    ["ational", "ate"],
    ["tional", "tion"],
    ["enci", "ence"],
    ["anci", "ance"],
    ["izer", "ize"],
    ["isation", "ize"],
    ["ization", "ize"],
    ["alism", "al"],
    ["ness", ""],
    ["ement", ""],
    ["ment", ""],
    ["ator", "ate"],
    ["alism", "al"],
    ["aliti", "al"],
    ["ousli", "ous"],
    ["ousness", "ous"],
    ["iveness", "ive"],
    ["fulness", "ful"],
  ];
  for (const [suffix, replacement] of step2) {
    if (w.endsWith(suffix) && w.length - suffix.length > 1) {
      w = w.slice(0, -suffix.length) + replacement;
      break;
    }
  }

  // Step 3 — final cleanup
  const step3: [string, string][] = [
    ["icate", "ic"],
    ["ative", ""],
    ["alize", "al"],
    ["iciti", "ic"],
    ["ical", "ic"],
    ["ful", ""],
    ["ness", ""],
  ];
  for (const [suffix, replacement] of step3) {
    if (w.endsWith(suffix) && w.length - suffix.length > 1) {
      w = w.slice(0, -suffix.length) + replacement;
      break;
    }
  }

  return w.length < 2 ? word : w;
}
