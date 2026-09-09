# Memory — react-ui-library migration, demo mode, and first Vercel deploy

Last updated: 2026-09-09

## What was built

- **Migrated `apps/web` onto `@ascentware/react-ui-library`** (replacing ~19 hand-built primitives in `components/ui/`). Phase 0 fixed the Tailwind v4 ↔ shadcn-slot token bridge in `app/globals.css` (`@theme inline` mappings for `card/popover/muted/accent/border/input/ring/destructive/success/warning/danger/nav*/chart-1..5`, plus `--spacing-btn-x/-y/-card-p`) and added a `@source` directive so Tailwind's JIT picks up the library's compiled classes. `Button/Input/Select/Textarea/Checkbox/Avatar/Badge/StatusPill` in `components/ui/` are now thin adapters around the library (kept the same call-site prop API on purpose — see Decisions). `TextField/TextareaField/SelectField` now wrap the library's own `Field`/`TextareaField`/`SelectField`; old `components/ui/SelectField.tsx` deleted, all its ~5 call sites converted to `options`/`onValueChange`.
- **Added a full "demo mode"**: `lib/demo-data.ts` holds sample content (`DEMO_PLATFORMS/DEMO_ORGANIZATIONS/DEMO_TEMPLATES/DEMO_POST_CONTENT/DEMO_IMAGE_BASE64`). "Load sample data" buttons on the Organizations/Platforms/Templates/Post list views, plus per-step "Fill test data" buttons inside `CreateOrganizationWizard` (Basic info / Select Platforms / Add Pages steps) and `PostWizard` (Type&Platform / Prompt step — this one calls a new `createTestDraft` action that **bypasses AI generation entirely**, since that needs the backend). New store actions: `seedDemoPlatforms` (platforms store — local-only, bypasses the API-backed store, non-persisted), `seedDemoPosts`/`createTestDraft` (posts store).
- **Fixed a long list of UI bugs** found while migrating: duplicate "Add Organization" button, missing Button padding (the token-bridge gap above), removed the "Ascentware" wordmark from the nav and added the real logo (`public/brand/ascentware-mark.png` via `BrandMark.tsx`), removed a dead non-functional "Settings" icon button, trimmed Create/Edit Organization forms down to Name/Description/Industry only (`deriveOrgCode` helper added to `lib/organizations/derive.ts` since Code is no longer user-entered), added `components/ui/PageLoading.tsx` to fix a blank-screen-during-hydration bug on Organizations/Platforms/Templates, fixed Badge/StatusPill text wrapping (`whitespace-nowrap`+`shrink-0`), fixed the Post-history filter `<Select>`s stretching full width on desktop (`w-full sm:w-44`), moved the sidebar's hidden-until-breakpoint from `sm` to `lg` so tablets use the same drawer as phones (`TopHeader.tsx`/`Sidebar.tsx`/`MobileSidebarDrawer.tsx`), and reworked all four data tables (Organizations/Platforms/Templates/PostHistory) to drop the forced `min-w-[640px]` and instead hide one secondary column each below `sm` so they fit mobile width without horizontal scroll.
- **Deployed `apps/web` to Vercel** — already-linked project "web" under org "prabha7", `rootDirectory: apps/web`. Live at **https://web-sand-six-27.vercel.app**.
- **Set up `.claude/skills/`** with 20 skills: 15 generic SDLC-role skills (architect, code-reviewer, devops-engineer, feature-developer, imprint, project-architect, qa-tester, recover, refactoring-specialist, remember, review, system-analyzer, technical-writer, test-engineer, ui-ux-designer) copied from a company skills library, plus a new **`ascentware-frontend-standards`** skill I authored — it replaces an HRMS/Spring-Boot-specific master doc with the real standards for this repo's actual stack (`@ascentware/react-ui-library`, Context+reducer stores, plain controlled forms, no Zustand/TanStack Query/React Hook Form). Also fixed `ascentware-project`'s skill, which incorrectly described an `apps/client`/`apps/admin`/Turborepo layout — corrected to the real `apps/web`/`apps/api` pnpm workspace.

## Decisions made

- **Full swap onto `@ascentware/react-ui-library`** for all custom UI primitives (explicit user choice, not a partial migration).
- **Adapter-in-place strategy**: kept `components/ui/*.tsx` as thin adapters translating this app's existing prop vocabulary onto the library's, instead of rewriting every call site to the library's native API — far lower risk across ~60 call sites, same end result (library renders everything).
- **Keep custom `icons.tsx`** (no lucide-react migration), **keep the custom `AppShell`** (no adoption of the library's opinionated `AppShell`/`AppSidebar`), **keep plain-`useState` forms** (no React Hook Form) — all three confirmed explicitly with the user during the migration plan.
- **Demo/test-data buttons are deliberately local-only and non-persisted** — they bypass the API on purpose so the app can be demoed fully without a live backend. A page reload wipes anything seeded into the (API-backed) Platforms store specifically.
- **Deploy scope is `apps/web` only**, via `git push` to `main` (the existing Vercel↔GitHub link). `apps/api` was deliberately left out of every commit — it has its own separate, still-in-progress Postgres/Neon migration and its own `vercel.json`/`.vercelignore`, which is the user's own parallel work, not something to fold in.

## Problems solved

- **First Vercel deploy failed**: `pnpm-lock.yaml` was out of sync with `apps/api`'s libsql→neon dependency swap (from a commit the user made directly, outside this session), causing `ERR_PNPM_OUTDATED_LOCKFILE` under `--frozen-lockfile`. Fixed by regenerating and committing the lockfile — redeploy succeeded.
- **Turbopack HMR staleness** produced misleading "seed button doesn't work" failures during testing — a hard page reload resolved it; not a real bug in the seed logic.
- **`.agents/skills/` vs `.claude/skills/`**: Claude Code's CLI only scans `.claude/skills/` for invocable skills; `.agents/skills/` is a separate cross-tool convention (Codex/AGENTS.md-style). Mirrored every new skill into `.claude/skills/` except the harness-managed `impeccable` package (left untouched — it's actively managed by the tooling itself, its content differs from `.agents/skills/impeccable` on purpose).

## Current state

- `apps/web` is live on Vercel and fully demoable end-to-end without `apps/api` running, via the seed/test-data buttons.
- `apps/api` is **not** deployed. It has its own in-progress Postgres/Neon migration (uncommitted by me, left as the user's own work). Real Connect/Publish actions in the UI still require it and will fail without it — expected, not a bug.
- No automated tests exist in `apps/web` yet (`vitest`/`@playwright/test` are installed as devDependencies but unused so far) — flagged honestly in the new `ascentware-frontend-standards` skill rather than claimed as covered.

## Next session starts with

⚠️ **Most urgent, still unresolved**: a live Azure DevOps registry credential was accidentally committed and pushed to this **public** GitHub repo (`prabhavasu14897/next-deploy`) in a commit made outside this session. It's since been removed from tracking (`.npmrc` added to `.gitignore`), but **the token itself must be rotated in Azure DevOps** — that has not been confirmed done as of this session ending. Ask the user directly whether it's been rotated; if not, that's the very first thing to raise next session, before anything else.

Secondary, non-urgent: `apps/api`'s Postgres/Neon migration + its own Vercel deployment is a separate open task the user may want to pick up later. Adding real Vitest/Playwright coverage is a reasonable next improvement once a specific area calls for it.

## Open questions

- Has the exposed Azure DevOps PAT been rotated yet? (see above)
- Does the user want the leaked credential scrubbed from git history too (force-push rewrite), now that it's rotated/being rotated — this is a bigger, more disruptive step that needs explicit sign-off before touching shared history.
- Is `apps/api`'s Neon/Postgres migration ready to deploy too, or still in progress on the user's side?
