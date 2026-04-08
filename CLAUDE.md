# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working instructions

- pnpm only — never suggest npm or yarn
- Check existing files before creating new ones
- Analysis engine in src/lib/engine/ has zero dependencies — keep it that way
- Never bypass RLS
- Use server.ts supabase client in server components, client.ts in client components
- sessionStorage in results/ is intentional — don't refactor it
- Check profiles.plan before gating any new paid features

## Commands

```bash
pnpm dev          # Start dev server (requires Node.js 22)
pnpm build        # Production build
pnpm start        # Run production build
pnpm lint         # ESLint check
pnpm test         # Jest (currently only src/lib/engine/engine.test.ts)
```

To run a single test file:

```bash
npx jest src/lib/engine/engine.test.ts
```

## Environment Variables

Requires `.env.local` with:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `RESEND_API_KEY` (email, deferred)

## Architecture

### App Overview

Shortlisted is a resume keyword analyzer and job application tracker. Core analyzer is entirely client-side (privacy-first, no server processing). The tracker (Kanban board) is behind a paid plan (Razorpay, India-first).

### Key Architectural Decisions

- **Analysis engine** (`src/lib/engine/`) is pure TypeScript with zero external dependencies. Uses TF-IDF scoring + Porter Stemmer + keyword gap detection. Public API is `analyseResume()` from `src/lib/engine/index.ts`.
- **Auth** is Supabase Auth (Google OAuth + email). Middleware in `src/middleware.ts` handles session refresh. Use `src/lib/supabase/server.ts` for server components/routes and `src/lib/supabase/client.ts` for client components.
- **Database** is Supabase Postgres with Row Level Security (RLS) enforced at DB level — don't bypass it. Application queries are in `src/lib/supabase/applications.ts`.
- **No global state library** — React hooks + Supabase client only.
- **Path alias:** `@/*` maps to `./src/*`.

### App Router Structure

```
src/app/
  page.tsx              # Landing page
  analyze/              # Resume + JD input form (client component: AnalyzeClient.tsx)
  results/              # Analysis results (reads from sessionStorage, set by analyze page)
  tracker/              # Kanban board (trackerClient.tsx) — requires auth + paid plan
  account/              # User profile
  auth/                 # Sign in/up pages + OAuth callback (route.ts)
  api/applications/     # REST API for CRUD operations on tracker applications
  privacy/ terms/ contact/
```

### Database Tables

- `applications` — tracker entries (status, notes, JD URL, etc.)
- `profiles` — user plan info (free vs. placement_pack)
- `reminders` — planned feature

### Payments

Razorpay integration for "Placement Pack" upgrade. Check `profiles.plan` to gate tracker access.

## Feature Status

- Resume Analyzer: complete
- Application Tracker: in progress
- Payments (Razorpay): pending
- Email (Resend): deferred

## Current focus

Job Tracker feature completion

## Last Session

### What changed

- Fixed 5 tracker bugs: vanish-on-refresh (isPack+null expiry), paywall dead code (`!true`), `getApplications()` missing user filter, `withdrawn` status invisible on board, nuclear `window.location.reload()` on delete failure
- Added edit functionality: ✎ button on cards, edit mode in `AddApplicationModal`, optimistic PATCH with rollback
- Replaced `confirm()` with custom `ConfirmDialog` component for delete
- `withdrawn` column added to Kanban (6 columns now)

### Key decisions

- `plan_expires_at` always required for pack access (null = not valid) — dev must set expiry manually in Supabase
- `getApplications()` now takes `userId` param (defense-in-depth alongside RLS)

### Next steps

- [ ] Visual redesign of tracker (user to spec next session)
- [ ] Continue accounts tab work (`add-accounts-tab` branch)
- [ ] Address 9 GitHub dependency vulnerabilities (4 high, 5 moderate)
- [ ] Razorpay integration (payments still pending)
