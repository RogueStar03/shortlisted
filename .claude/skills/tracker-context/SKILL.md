---
name: tracker-context
description: Load Shortlisted tracker feature context — Supabase schema, RLS rules, payment gating, Kanban board. Auto-invoke when working on the tracker, application management, Kanban board, or payment gating.
---

# Tracker Context

You are working on the Shortlisted application tracker feature. Here is the critical context:

## Key files

- `src/app/tracker/page.tsx` — server component, fetches user + applications, passes to client
- `src/app/tracker/trackerClient.tsx` — all tracker UI, drag-drop, edit/delete, paywall
- `src/app/tracker/addApplicationModal.tsx` — add + edit modal (edit mode via `editingApp` prop)
- `src/app/api/applications/` — REST API for CRUD
- `src/lib/supabase/applications.ts` — `getApplications(userId)` — always requires userId param

## Database schema

`applications` table: `id`, `user_id`, `company`, `role`, `status`, `notes`, `jd_url`, `created_at`
`profiles` table: `user_id`, `plan` ('free' | 'placement_pack'), `plan_expires_at`

## Payment gating rules

```typescript
const isPack = profile.plan === 'placement_pack' && 
               profile.plan_expires_at != null && 
               new Date(profile.plan_expires_at) > new Date()
```

`isPack` must be `true` for tracker access. `plan_expires_at` null is NOT treated as "forever valid".

## Status columns

`applied` | `interviewing` | `offer` | `rejected` | `withdrawn` — all 5 must appear in COLUMNS array or apps with that status silently drop from board.

## RLS policy

RLS is enforced at DB level. Additionally, always filter by `user_id` in code (`getApplications(userId)` requires the param).

## Current state

Read `/mnt/d/Personal Projects/Vaults/DevBrain/Projects/Shortlisted/Current-State.md` for latest tracker bugs and status.

> MCP future: Replace Read call with `obsidian_get_file_contents` for Projects/Shortlisted/Current-State.md
