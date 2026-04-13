---
name: engine-context
description: Load Shortlisted analysis engine context — TF-IDF scoring, Porter Stemmer, keyword gap detection. Auto-invoke when working on src/lib/engine/ or the resume analysis pipeline.
---

# Analysis Engine Context

You are working on the Shortlisted client-side analysis engine.

## Core constraint

`src/lib/engine/` is **pure TypeScript with zero external dependencies**. Resumes never leave the browser — do not add server calls, fetch requests, or any dependency that isn't already there.

## Public API

Entry point: `src/lib/engine/index.ts`
Main export: `analyseResume(resumeText: string, jobDescription: string): AnalysisResult`

## How it works

1. **Tokenisation + stemming** — Porter Stemmer normalises both resume and JD text
2. **TF-IDF scoring** — weights keywords by frequency × inverse document frequency
3. **Keyword gap detection** — identifies JD keywords absent from resume
4. **Score calculation** — returns match percentage + keyword lists

## Path alias

`@/lib/engine/*` → `src/lib/engine/*`

## What to read

Before making changes, read `src/lib/engine/index.ts` to understand the public API, then read the specific file you're changing.

Do not add dependencies to this directory. Do not make network requests. Keep all logic synchronous.
