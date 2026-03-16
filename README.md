# Shortlisted

**Built to get you shortlisted.**

A resume keyword analyzer and job application tracker. Paste your resume and a job description — get a match score, keyword gaps, filler word detection, and actionable fixes in under a second. Built for job seekers who are tired of getting ghosted.

🔗 **Live demo:** [shortlisted-beta.vercel.app](https://shortlisted-beta.vercel.app)

---

## What it does

**Resume Analyzer (free, unlimited)**

- Compares your resume against a job description using TF-IDF keyword scoring
- Shows which keywords are missing, grouped by category (Tools, Technical, Soft Skills)
- Detects 60+ filler phrases ("responsible for", "team player", "hardworking") with specific rewrite suggestions
- Weighted match score — technical skills and tools rank higher than soft skills
- Runs entirely client-side — your resume text never leaves your browser

**Application Tracker (Placement Pack)**

- Kanban board: Applied → Screening → Interview → Offer → Rejected
- Drag-and-drop status updates with optimistic UI
- Notes, JD URL, and applied date per application
- Follow-up reminders and analytics (in progress)

---

## Architecture

### Analysis engine (`src/lib/engine/`)

The core of the product. Pure TypeScript, zero dependencies, runs in the browser.

```
tokeniser.ts      → lowercase, strip punctuation, expand aliases (k8s → kubernetes)
stopwords.ts      → 400+ word filter including resume noise ("responsible", "experience")
stemmer.ts        → lightweight Porter Stemmer, NOSTEM set protects technical terms
tfidf.ts          → TF-IDF scoring against pre-computed reference IDF corpus
gapAnalyser.ts    → compares top 30 JD keywords vs resume tokens
fillerDetector.ts → 60-phrase blacklist with replacement suggestions
scorer.ts         → weighted match score (technical=1.0, tool=1.0, general=0.5, soft=0.3)
index.ts          → public API: analyseResume(resumeText, jdText) → AnalysisResult
```

Key decisions:

- **No AI in MVP** — deterministic logic is fast, free, and debuggable. Claude Haiku planned for v2 bullet rewrites.
- **Signal-based filtering** — unknown terms only pass if they appear 2+ times in the JD AND exceed a TF-IDF threshold. This kills location names, company names, and posting metadata without a blocklist.
- **Category weighting** — a JD mentioning "kubernetes" once matters more than "communication" three times. Weights are applied in the scorer, not the extractor.

### Stack

| Layer     | Choice                  | Why                                                                                          |
| --------- | ----------------------- | -------------------------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router) | One codebase for frontend + API routes. Vercel deployment is zero-config.                    |
| Styling   | Tailwind CSS            | Utility-first keeps styling colocated. No dead CSS.                                          |
| Auth      | Supabase Auth           | Google OAuth in 3 clicks. Auth UID = database UID — no glue code. RLS enforced at DB level.  |
| Database  | Supabase Postgres       | Full SQL with joins and aggregations. RLS means the DB enforces access control, not the app. |
| Hosting   | Vercel (Hobby)          | Free tier, auto-deploys on push, global CDN, preview URLs per PR.                            |
| Payments  | Razorpay                | India-first. Native UPI. 2% flat fee. Direct INR settlement. No FIRC complexity.             |
| Emails    | Resend                  | Deferred — needs custom domain first.                                                        |

### Why the analyzer runs client-side

Most resume tools send your resume to a server. That means your employment history, contact details, and career gaps are stored somewhere you don't control.

Running analysis in the browser means:

- Zero server cost per analysis (important at MVP stage with no revenue)
- No privacy risk — we never see the content
- Instant results — no network round-trip
- Scales to any number of free users for free

The tradeoff is that we can't do server-side ML or store scan history for free users. That's an acceptable tradeoff at this stage.

---

## Running locally

**Prerequisites:** Node.js 22, pnpm

```bash
git clone https://github.com/yourusername/shortlisted
cd shortlisted
pnpm install
```

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Set up the database — run these SQL blocks in your Supabase SQL editor in order:

1. `supabase/migrations/001_profiles.sql`
2. `supabase/migrations/002_applications.sql`
3. `supabase/migrations/003_application_events.sql`
4. `supabase/migrations/004_reminders.sql`

```bash
pnpm dev
```

App runs at `http://localhost:3000`.

**Run the engine smoke test:**

```bash
pnpm tsx src/lib/engine/engine.test.ts
```

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── auth/                       # Sign in / sign up + OAuth callback
│   ├── analyze/                    # Resume + JD input (client-side analysis)
│   ├── results/                    # Analysis results UI
│   ├── tracker/                    # Kanban board (Placement Pack)
│   ├── privacy/ terms/ contact/    # Legal pages
│   └── api/applications/           # REST API for tracker CRUD
├── components/
│   ├── ui/                         # Button, Card, Badge, ScoreBar
│   ├── layout/                     # Navbar
│   └── landing/                    # HowItWorks animated section
└── lib/
    ├── engine/                     # Analysis engine (8 files, zero dependencies)
    ├── supabase/                   # Browser + server clients, applications queries
    └── constants/                  # Color tokens
```

---

## Status

| Feature                           | Status         |
| --------------------------------- | -------------- |
| Resume analyzer                   | ✅ Complete    |
| Auth (Google + email)             | ✅ Complete    |
| Landing page                      | ✅ Complete    |
| Application tracker (Kanban)      | ✅ Complete    |
| Payments (Razorpay)               | 🔄 In progress |
| Follow-up reminders               | ⏳ Planned     |
| Analytics dashboard               | ⏳ Planned     |
| PDF resume upload                 | ⏳ v2          |
| AI bullet rewrites (Claude Haiku) | ⏳ v2          |

---

## Built with

This project was built collaboratively with [Claude](https://claude.ai) (Anthropic) over several sessions — architecture decisions, engine design, UI components, and all code written together. The analysis engine, stack choices, and product decisions are documented in detail across the build sessions.

---

## License

MIT — use it, learn from it, build on it.
