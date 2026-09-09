---
name: ascentware-project
description: Guidelines and architectural rules for Ascentware projects.
---

# Ascentware Project Standards

## Repository

This repository (`design-smp`, the social media management platform) is a **pnpm workspace** (not Turborepo — there is no `turbo.json`).
Applications:

- `apps/web` — the Next.js App Router frontend (organizations, platforms, templates, posts).
- `apps/api` — the NestJS + Prisma backend, PostgreSQL (Neon) in production.

There is no separate client/admin split in this repo — `apps/web` is a single operational admin-style application. `packages/*` is declared in `pnpm-workspace.yaml` for future shared packages but is currently empty; do not assume shared packages exist without checking.

For the detailed, adapted version of the company-wide frontend engineering standards (UI library usage, state management, ports/adapters, testing, code review checklist, non-negotiable rules) for this specific stack, see the `ascentware-frontend-standards` skill.

## Architecture rules

- Do not move `apps/web`-specific code into `packages/` speculatively — only extract a shared package when a second real consumer exists.
- All UI primitives must come from `@ascentware/react-ui-library` (see `apps/web/components/ui/*.tsx` adapters) — do not import a different third-party UI library into feature code.
- Each domain (`organizations`, `platforms`, `templates`, `posts`) owns its own `lib/<domain>/store.tsx` (React Context + reducer, localStorage-persisted where noted) and, where it talks to the backend, a sibling `lib/<domain>/api-client.ts`. Components consume the store via its `use<Domain>()` hook — never call `fetch`/`axios` directly from a component.
- Do not directly duplicate an existing domain's API client — extend it.
- Do not introduce new dependencies without checking whether an existing one already covers the need (this repo deliberately does not use Zustand, TanStack Query, or React Hook Form — see the `ascentware-frontend-standards` skill for why).

## Backend

NestJS + Prisma is the API source of truth (`apps/api`). Do not invent API contracts — inspect the existing NestJS modules/controllers and Prisma schema (`apps/api/prisma/schema.prisma`) before implementing frontend integration. The database is PostgreSQL (Neon) — the schema was migrated off SQLite/libsql; do not reintroduce SQLite-specific assumptions.

## Completion

A feature is not complete until:

- implementation works
- loading state exists
- empty state exists
- error state exists
- validation exists
- responsive behavior works
- accessibility is checked
- tests exist where appropriate
- performance has been reviewed
- UI has been visually reviewed
