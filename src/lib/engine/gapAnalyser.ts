import { extractKeywords, ScoredKeyword } from "./tfidf";
import { tokenise } from "./tokeniser";
import { stem } from "./stemmer";
import STOPWORDS from "./stopwords";

export interface KeywordMatch {
  term: string;
  stemmed: string;
  jdFrequency: number; // Raw count in JD
  tfidf: number; // Importance score
  category: ScoredKeyword["category"];
  foundInResume: boolean;
}

export interface GapAnalysis {
  missing: KeywordMatch[]; // JD keywords absent from resume
  found: KeywordMatch[]; // JD keywords present in resume
  topKeywords: ScoredKeyword[]; // Top 30 JD keywords by TF-IDF
}

export function analyseGap(resumeText: string, jdText: string): GapAnalysis {
  // Extract and score JD keywords
  const jdKeywords = extractKeywords(jdText).slice(0, 30);

  // Build a set of stemmed tokens from the resume for fast lookup
  const resumeTokens = tokenise(resumeText).filter(
    (t) => !STOPWORDS.has(t) && t.length > 1,
  );
  const resumeStemmed = new Set(resumeTokens.map((t) => stem(t)));

  const missing: KeywordMatch[] = [];
  const found: KeywordMatch[] = [];

  for (const kw of jdKeywords) {
    const inResume =
      resumeStemmed.has(kw.stemmed) ||
      // Also check if the raw term appears directly (catches multi-word phrases)
      resumeText.toLowerCase().includes(kw.term.toLowerCase());

    const match: KeywordMatch = {
      term: kw.term,
      stemmed: kw.stemmed,
      jdFrequency: kw.rawTf,
      tfidf: kw.tfidf,
      category: kw.category,
      foundInResume: inResume,
    };

    if (inResume) found.push(match);
    else missing.push(match);
  }

  // Missing sorted by TF-IDF — most important gaps first
  missing.sort((a, b) => b.tfidf - a.tfidf);
  found.sort((a, b) => b.tfidf - a.tfidf);

  return { missing, found, topKeywords: jdKeywords };
}
