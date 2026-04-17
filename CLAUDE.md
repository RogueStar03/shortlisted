# Shortlisted

Resume keyword analyzer + job application tracker. Built with Next.js (App Router) + Supabase + TypeScript. Analysis engine runs entirely client-side (no server processing — privacy-first). Tracker is a paid feature gated by Razorpay.

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
| Payments | Razorpay |
| Package manager | pnpm |
| CI | GitHub Actions (lint, typecheck, test, build) |
| Tests | Jest + ts-jest |

## Hard rules

1. **RLS is enforced at the DB level — never bypass it.** Always add code-level `user_id` filters too.
2. **`src/lib/engine/` is pure TypeScript — zero external dependencies.** The analysis engine never touches the server; resumes never leave the browser.
3. **`sessionStorage` for analysis results is intentional.** Results page reads from `sessionStorage`. Don't move this to server/DB.
4. **No global state library.** React hooks + Supabase client only. No Redux, Zustand, etc.
5. **`isPack` requires `plan_expires_at` non-null AND future.** Null is not treated as "forever valid".
6. **Schema changes are migration PRs only.** Never edit Supabase dashboard schema directly. Use `supabase migration new <name>` + commit the file.
7. **`isPack` check goes through `src/lib/auth/isPack.ts`.** Don't inline the plan + expiry check.
8. **Server logs use `src/lib/log.ts`.** Emit JSON lines so they're queryable in Vercel logs.

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

**2026-04-14 — Demo mode: paywall removed, dark theme on all public pages**

### What changed
- `src/app/tracker/page.tsx` — removed isPack plan check; always fetches applications
- `src/app/tracker/trackerClient.tsx` — removed isPack prop, PaywallOverlay component, unused Link import
- `src/app/account/page.tsx` — removed upgrade CTA; tracker link always visible
- `src/app/page.tsx` — removed pricing section/array; auth-aware nav (Open app vs Sign in)
- `src/app/terms/page.tsx`, `privacy/page.tsx`, `contact/page.tsx` — dark theme + auth-aware nav
- `src/components/layout/Navbar.tsx` — logo links to `/` instead of `/analyze`
- `src/components/ui/card.tsx`, `landing/howItWorks.tsx` — dark theme via --sl-* CSS vars
- Paywall code preserved on remote branch `paywall/implementation`
- All changes pushed to `main`

### Key decisions
- Paywall bypassed by removing the gate entirely (not `isPack = true`) to avoid Supabase side-effect errors
- Public pages (landing, terms, privacy, contact) are now async server components to check auth

### Next steps
- [ ] Razorpay integration (payments still pending)
- [ ] Re-enable paywall from `paywall/implementation` branch when payments are ready
- [ ] Address GitHub dependency vulnerabilities (2 critical, 6 high, 5 moderate)
