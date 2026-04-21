# Shortlisted

Resume keyword analyzer + job application tracker. Built with Next.js (App Router) + Supabase + TypeScript. Analysis engine runs entirely client-side (no server processing — privacy-first). Demo mode — no payments.

## Vault context

For current project state, read:
`/mnt/d/Personal Projects/Vaults/DevBrain/Projects/Shortlisted/Current-State.md`

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) |
| Language | TypeScript (`@/*` → `./src/*`) |
| Auth | Supabase Auth (Google OAuth + email) |
| Database | Supabase Postgres |
| Package manager | pnpm |
| CI | GitHub Actions (lint, typecheck, test, build) |
| Tests | Jest + ts-jest |

## Hard rules

1. **RLS is enforced at the DB level — never bypass it.** Always add code-level `user_id` filters too.
2. **`src/lib/engine/` is pure TypeScript — zero external dependencies.** The analysis engine never touches the server; resumes never leave the browser.
3. **`sessionStorage` for analysis results is intentional.** Results page reads from `sessionStorage`. Don't move this to server/DB.
4. **No global state library.** React hooks + Supabase client only. No Redux, Zustand, etc.
5. **Schema changes are migration PRs only.** Never edit Supabase dashboard schema directly. Use `supabase migration new <name>` + commit the file.
6. **Server logs use `src/lib/log.ts`.** Emit JSON lines so they're queryable in Vercel logs.

## Two Supabase clients

- `src/lib/supabase/server.ts` — server components / route handlers
- `src/lib/supabase/client.ts` — client components

Never mix them. Always use the correct one for the rendering context.

## Local setup

```bash
cp .env.example .env.local   # then fill in real values
pnpm install
pnpm dev
```

## Last Session

**2026-04-21 — Remove payment references from public repo**

### What changed
- `package.json` — removed `razorpay` dependency
- `.env.example` — removed Razorpay env vars
- `supabase/migrations/0001_remove_payment_columns.sql` — drops `plan`, `plan_expires_at`, `pack_started_at`, `razorpay_customer_id` from profiles
- `src/lib/auth/isPack.ts` + `src/lib/auth/__tests__/isPack.test.ts` — deleted (5 engine tests remain, all passing)
- `src/app/account/page.tsx` — removed plan card, isPack import, profile query
- `src/app/privacy/page.tsx` — removed payment data section
- `src/app/terms/page.tsx` — removed payments section, renumbered sections
- `src/app/contact/page.tsx` — removed Razorpay from built-with list
- `CLAUDE.md`, `README.md` — removed all Razorpay/payment references
- Branch: `feat/phase-0-hardening` (not yet merged — this session's changes added to same branch)

### Key decisions
- Shortlisted stays a portfolio demo on `main` — no payments, no paywall, no upgrade CTAs
- Strategic direction (start fresh vs continue) still being decided
- `pnpm.overrides` used for transitive dep security rather than waiting for upstream
- React Compiler ESLint violations demoted to warnings (pre-existing, separate cleanup task)

### Next steps
- [ ] Open PR: `feat/phase-0-hardening` → `main`
- [ ] Decide on fresh start vs continuing Shortlisted for AI/revenue work
