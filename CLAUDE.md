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

## Hard rules

1. **RLS is enforced at the DB level — never bypass it.** Always add code-level `user_id` filters too.
2. **`src/lib/engine/` is pure TypeScript — zero external dependencies.** The analysis engine never touches the server; resumes never leave the browser.
3. **`sessionStorage` for analysis results is intentional.** Results page reads from `sessionStorage`. Don't move this to server/DB.
4. **No global state library.** React hooks + Supabase client only. No Redux, Zustand, etc.
5. **`isPack` requires `plan_expires_at` non-null AND future.** Null is not treated as "forever valid".

## Two Supabase clients

- `src/lib/supabase/server.ts` — server components / route handlers
- `src/lib/supabase/client.ts` — client components

Never mix them. Always use the correct one for the rendering context.

## Last Session

<!-- Claude writes here at session end — keep under 20 lines -->
