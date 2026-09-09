---
name: ascentware-frontend-standards
description: Ascentware's shared frontend engineering standards (SOLID, approved UI library usage, design tokens, ports/adapters, state management, forms, testing, code review) adapted to this repo's actual stack — Next.js App Router + NestJS/Prisma, no Zustand/TanStack Query/React Hook Form. Single source of truth for how apps/web is built.
---

# Ascentware `design-smp` Frontend Skill

You are working on **`design-smp`**, Ascentware's social-media-management platform — a pnpm workspace with two apps:

- `apps/web` — Next.js App Router frontend (Organizations, Platforms, Templates, Post).
- `apps/api` — NestJS + Prisma backend, PostgreSQL (Neon) in production.

This document is the **adapted, project-specific version** of Ascentware's common frontend standards. The underlying company principles (SOLID, one approved UI library, no direct API calls from components, single source of truth, testing discipline, code review rigor) are the same ones applied across every Ascentware repo. What differs here is the concrete stack: **this repo does not use Zustand, TanStack Query, React Hook Form, Zod, or date-fns** — those are other repos' choices, not this one's. Do not introduce them speculatively; if a real need for a query cache or complex form state arises, raise it as a deliberate decision, not a default.

---

# 1. Core Engineering Principles

Always follow **SOLID principles** — same as every other Ascentware repo.

## Single Responsibility Principle
- One component = one responsibility. Separate UI, business logic, API calls, and state.
- Example already in this repo: `components/organizations/OrganizationsView.tsx` (container: state, filtering, handlers) vs. `OrganizationsTable.tsx` (presentational: renders rows).

## Open/Closed Principle
- Extend behavior through composition and props, not by editing a shared primitive for one call site's need.

## Liskov Substitution Principle
- A component wrapping a react-ui-library primitive (see §3) must remain substitutable for that primitive's own props contract wherever reasonable.

## Interface Segregation Principle
- Prefer small, focused prop interfaces over "god props" objects.

## Dependency Inversion Principle
- Components depend on a domain's `use<Domain>()` hook (an abstraction), never on `fetch`/`axios`/a concrete backend URL directly.

---

# 2. Required Design Patterns

## Container / Presentational
```tsx
// container
export function OrganizationsView() {
  const { state, createOrganization } = useOrganizations();
  return <OrganizationsTable organizations={state.organizations} ... />;
}
// presentational
export function OrganizationsTable({ organizations, ... }: Props) { ... }
```

## Custom Hook Pattern
Every domain store exposes its state and actions through one hook:
```tsx
const { state, createOrganization, updateOrganization } = useOrganizations();
```

## Compound Component Pattern
Mandatory for reusable complex UI — this is what `@ascentware/react-ui-library` already gives you:
```tsx
<Dialog>
  <DialogContent>
    <DialogHeader><DialogTitle>...</DialogTitle></DialogHeader>
    <DialogFooter>...</DialogFooter>
  </DialogContent>
</Dialog>
```

## Adapter Pattern
Used in two places in this repo — know both:
1. **UI adapters** (`apps/web/components/ui/*.tsx`) — thin wrappers translating this app's semantic prop API (e.g. `variant="primary"`) onto the library's own vocabulary (e.g. `variant="default"`). See §3.
2. **API adapters** (`lib/<domain>/api-client.ts`) — translate backend DTOs into the frontend's view-model shapes. See §7.

---

# 3. `@ascentware/react-ui-library` — the only approved UI source

All visual UI primitives must come from **`@ascentware/react-ui-library`**, either directly or through this repo's local adapter layer. Do not import Material UI, Ant Design, Chakra, Bootstrap, Mantine, PrimeReact, or raw Radix/Headless-UI primitives into feature code, and do not hand-roll a primitive (`<button className="...">`) that the library already provides.

## Two ways it's consumed in this repo — use the right one

**Through the local adapter** (`components/ui/*.tsx`) when one exists for the primitive you need — these translate this app's own prop vocabulary onto the library's:

```tsx
import { Button, IconButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Checkbox } from "@/components/ui/Checkbox";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
```

Adapters exist for: `Button`/`IconButton`, `Input`, `Textarea`, `Select`, `Checkbox`, `Avatar`, `Badge`, `TextField`, `TextareaField`, `PageLoading`. `Input`/`Textarea` are direct re-exports (the library's shape already matches); `Select` reimplements the library's Radix-based compound API behind a native-`<select>`-shaped surface (`value`/`onChange`/`<option>` children) so existing call sites don't need to change — see the adapter's own comments before touching it, it has real constraints (Radix `SelectItem` rejects an empty-string value; the adapter handles this with a sentinel).

**Directly from the library** for everything else — `SelectField`, `Dialog`/`AlertDialog`/`Sheet` families, `Card`, `Tabs`, `Table`, etc.:

```tsx
import { SelectField } from "@ascentware/react-ui-library";
```

### Rules
- Before adding a new UI need, check: is there an adapter in `components/ui/`? If yes, use it. If not, check whether the library exports the primitive directly — import it from `@ascentware/react-ui-library`.
- Only build a new local adapter when the library's own prop vocabulary needs translating to match this app's existing call-site conventions (as Button/Select do). Don't add an adapter that just re-exports with no translation — import the library directly instead (see `Input.tsx`/`Textarea.tsx` for the one-line re-export shape when you do need the indirection for a future migration step).
- `components/ui/icons.tsx` (~39 hand-drawn SVGs) is a deliberate exception — this app's icon set is not sourced from the library. Do not replace it with `lucide-react` (an unused dependency) without an explicit design decision.

### Correct
```tsx
<Button variant="primary" size="sm">Save</Button>
```
### Avoid
```tsx
<button className="rounded bg-blue-600 px-3 py-1.5 text-white">Save</button>
```

---

# 4. Ascentware Design System — token bridge (read before adding a new library component)

Design tokens come from `@ascentware/design-system` (`theme.css`), layered with this app's own two brand themes ("Luminous Light" / "Luminous Dark") in `apps/web/app/globals.css`. Dark/light is driven by the `.dark` class + `data-asw-theme="luminous-dark"|"luminous-light"` attribute on `<html>`, set by `ThemeToggle.tsx` and a pre-hydration inline script in `layout.tsx` (no flash of the wrong theme).

**The gotcha every new react-ui-library component hits**: Tailwind v4 only generates a utility class (`bg-card`, `border-input`, `ring-ring`, `px-btn-x`) from a `--color-*` / `--spacing-*` key declared in `@theme inline`. The shadcn-style slots (`--card`, `--popover`, `--muted`, `--accent`, `--border`, `--input`, `--ring`, `--destructive`, `--success/warning/danger`, `--nav*`, `--chart-1..5`) and non-color tokens (`--btn-x`, `--btn-y`, `--card-p`) exist as bare values from the design-system import, but **do not become real Tailwind classes until bridged** in the `@theme inline` block of `globals.css`. If you add a library component and it renders unstyled/invisible, check whether its class references a token that isn't bridged yet — add the mapping (`--color-x: hsl(var(--x))` for colors, `--spacing-x: var(--x)` for spacing) rather than hardcoding a color/size inline.

`--background`/`--foreground`/`--primary`/`--secondary` are the one deliberate exception: they stay as literal hex in this app's own `:root`/`.dark` (consumed unwrapped by `@theme inline { --color-background: var(--background) }`) rather than the design-system's bare-HSL versions, to avoid a naming collision — see the comment block above `.dark[data-asw-theme="luminous-dark"]` in `globals.css` before changing this.

---

# 5. State Management — React Context + reducer (no Zustand, no TanStack Query)

This repo's actual pattern, used consistently across all four domains:

```tsx
// lib/organizations/store.tsx
const [state, dispatch] = useReducer(reducer, initialState);
// hydrate from localStorage on mount, persist on change (organizations/templates/posts)
// platforms is the exception — fully API-backed, no localStorage persistence
export function useOrganizations() {
  const ctx = useContext(OrganizationsContext);
  if (!ctx) throw new Error("useOrganizations must be used within OrganizationsProvider");
  return ctx;
}
```

- **Server state and client state live in the same store** — there is no separate query-cache layer. Organizations/Templates/Post are localStorage-persisted client state; Platforms is server-backed (its store's `refetch()` calls the API on mount, and `createPlatform`/`updatePlatform`/`deletePlatform` all round-trip through it).
- Do **not** add Zustand or TanStack Query to introduce a "proper" global-state/query-cache layer unless there's a real, current need that the existing Context+reducer pattern can't meet — that's a deliberate architectural decision to raise with the team, not a default to reach for.
- Demo/offline seeding (`seedDemoPlatforms`, `seedDemoPosts`, the `DEMO_*` data in `lib/demo-data.ts`) is a **local-only, non-persisted** escape hatch for showing the app populated without a live backend — it bypasses the API on purpose and is clearly commented as such. Don't mistake it for the real create/update path.

---

# 6. Next.js App Router structure (actual, not aspirational)

```text
apps/web/
├── app/                     # route pages: dashboard, organizations, post, templates, add-platform, ...
├── components/
│   ├── ui/                  # react-ui-library adapters — see §3
│   ├── app-shell/           # TopHeader, Sidebar, MobileSidebarDrawer, ThemeToggle, Footer
│   ├── organizations/
│   ├── platforms/
│   ├── templates/
│   └── posts/
└── lib/
    ├── organizations/       # store.tsx, types.ts, derive.ts, reference-data.ts, id.ts
    ├── platforms/            # store.tsx, api-client.ts
    ├── templates/            # store.tsx, icon-registry.ts
    ├── posts/                # store.tsx, api-client.ts, optimization.ts, publish-support.ts
    └── demo-data.ts          # sample content for the "Load sample data" / "Fill test data" buttons
```

Each real screen has its own route page under `app/`; pages stay thin and compose the corresponding `components/<domain>/` view.

**Navigation is centralized, at the scale this app needs**: `SidebarNavLinks.tsx`'s `LINKS` array is the single source of truth for the sidebar (href, label, icon) — don't hardcode a second nav array elsewhere, and don't duplicate a label/href literal across the sidebar, a dashboard card, and a breadcrumb. This app has no auth/roles yet, so there is no permission-driven registry to build here — don't add one speculatively; if roles/permissions are introduced later, that's when a registry earns its place.

---

# 7. API layer — ports/adapters, no direct fetch in components

React components must never call the backend directly.

```text
component -> use<Domain>() hook -> store action -> lib/<domain>/api-client.ts -> NestJS (apps/api) -> Prisma -> PostgreSQL
```

## Real example (`lib/platforms/api-client.ts`)
```ts
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { headers: { "content-type": "application/json" }, ...init });
  } catch {
    throw { code: "unknown", message: `Couldn't reach the API at ${API_URL}.` } satisfies ApiError;
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw { code: payload?.code ?? "unknown", message: payload?.message ?? `Request failed (${response.status}).` } satisfies ApiError;
  }
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
```

## Rules
- No `fetch()`/`axios` inside presentational or page components — only inside a domain's `api-client.ts`.
- NestJS (`apps/api`) remains authoritative for validation and business logic; the frontend adapter shapes requests/responses, it does not duplicate domain logic.
- Errors surface as a typed `ApiError` (`{ code, message }`), caught and turned into a `status: "error"`/`"failed"` + message on the affected record (see `ConnectionStatus`, `TabStatus`) — never show a raw exception to the user.
- Do not add a second, differently-shaped API client for the same domain — extend the existing one.

---

# 8. Forms & Validation — plain controlled state (no React Hook Form / Zod)

This is a deliberate choice, confirmed when migrating onto `@ascentware/react-ui-library`: introducing React Hook Form would be a new form-state paradigm the app doesn't otherwise need. Current pattern:

```tsx
const [draft, setDraft] = useState<OrganizationDraft>(EMPTY_DRAFT);
function update<K extends keyof OrganizationDraft>(key: K, value: OrganizationDraft[K]) {
  setDraft((d) => ({ ...d, [key]: value }));
}
const basicsValid = draft.name.trim().length > 0;
```

- Validation is a plain boolean/derived expression gating the submit button (`basicsValid`, `editValid`, `valid`), not a schema library.
- If a form's validation genuinely outgrows this (many interdependent fields, async validation, complex error trees), raise adopting React Hook Form + Zod as an explicit decision — don't introduce it unilaterally for one form.

---

# 9. Error, Loading, and Empty States

```tsx
if (!state.hydrated) return <PageLoading />;   // components/ui/PageLoading.tsx
...
<EmptyState title="No organizations yet" description="..." />
```

- Every view that waits on store hydration or an API call must show `PageLoading`, never a bare empty `<div>` — a blank screen during a slow/offline API reads as broken, not loading.
- Every zero-data view uses `EmptyState`, with an action button where there's an obvious next step.
- Every error state uses the domain's own `status: "error"` + message, rendered via `Badge`/`StatusPill`, never a thrown exception reaching the UI.

---

# 10. Performance Standards

## Required where it earns its keep
- `React.memo` / `useMemo` / `useCallback` for genuinely expensive derivations or to stabilize a callback identity a child depends on.
- Route-level code splitting (Next.js App Router gives you this by default per route).

## Avoid
- Memoizing trivial components/values "just in case" — this repo's own convention is no premature abstraction; three similar lines beat a speculative `useMemo`.
- Unnecessary global state, deep prop drilling, oversized components.

---

# 11. Testing Standards

**Current state, honestly**: `vitest`, `@testing-library/react`, `@testing-library/user-event`, and `@playwright/test` are already devDependencies of `apps/web`, but **no test files exist in this repo yet**. Don't claim coverage that isn't there.

## Going forward
- New non-trivial hooks, stores, and derive/utility functions (`lib/*/derive.ts`, `lib/*/store.tsx` reducers) should get Vitest unit tests.
- Critical user journeys — create-organization wizard, connect-platform flow, post wizard end to end — should get Playwright E2E coverage as they stabilize.
- Test observable behavior (what the user sees/can do), not internal implementation details.
- Never report a test as passing without having actually run it.

## Required Verification (run before calling anything done)
```bash
pnpm --filter web lint
npx tsc --noEmit -p apps/web/tsconfig.json
pnpm --filter web build
```
Add `pnpm --filter web test` / `pnpm --filter web test:e2e` to this list once real test files exist for the area you touched.

---

# 12. Domain Conventions

## Status enums (real, already in this codebase)
```ts
export type ConnectionStatus = "not_connected" | "connecting" | "connected" | "error";
export type OrganizationStatus = "active" | "inactive";
export type TabStatus = "generating" | "ready" | "draft" | "scheduled" | "posting" | "posted" | "failed";
```

## Date handling
Plain `Date` + `toLocaleDateString` (`formatDate` in `lib/organizations/derive.ts`). This repo does not depend on `date-fns` — don't add it for one call site; extend `derive.ts` instead.

## IDs
`makeId(prefix)` (`lib/organizations/id.ts`) — `crypto.randomUUID()` when available, prefixed (`org_...`, `platform_...`, `post_...`). Reuse it; don't hand-roll another ID generator.

---

# 13. Mandatory Shared Dependencies (actual)

- React 19, Next.js 16 (App Router), TypeScript
- `@ascentware/react-ui-library`, `@ascentware/design-system`
- `clsx` + `tailwind-merge` (via the local `cn` helper, `lib/cn.ts`)
- Vitest, React Testing Library, Playwright (for tests as they're added — see §11)
- NestJS, Prisma, PostgreSQL (Neon) — `apps/api`

**Deliberately not part of this stack** — do not add without an explicit decision: Zustand, TanStack Query, React Hook Form, Zod, date-fns, Axios.

---

# 14. Code Review Checklist

Before merging any PR in `apps/web`:

- [ ] SOLID principles followed
- [ ] Uses `@ascentware/react-ui-library` (directly or via a `components/ui/` adapter) — no third-party UI library, no hand-rolled primitive duplicating one the library already provides
- [ ] Any new library component's classes actually render — check the token bridge in §4 rather than hardcoding a color/spacing value
- [ ] No `fetch`/`axios` inside a component — goes through `lib/<domain>/api-client.ts`
- [ ] State lives in the right place: domain data in the Context/reducer store, not scattered `useState` duplicating it elsewhere
- [ ] Forms use plain controlled state consistent with §8 (no RHF introduced without a prior explicit decision)
- [ ] Loading (`PageLoading`), empty (`EmptyState`), and error states handled — see §9
- [ ] Accessibility considered (keyboard nav, focus states, semantic HTML, ARIA where needed)
- [ ] No hardcoded nav label/href duplicated outside `SidebarNavLinks.tsx`'s `LINKS`
- [ ] Tests added where §11 calls for them, and actually run
- [ ] `pnpm --filter web lint`, `tsc --noEmit`, and `pnpm --filter web build` all pass
- [ ] UI has been visually checked in **both** light and dark theme, and at mobile/tablet/desktop widths

---

# 15. Non-Negotiable Rules

1. **No direct backend calls inside React components** — always through a domain's `api-client.ts`.
2. **All UI primitives come from `@ascentware/react-ui-library`**, directly or through a `components/ui/` adapter.
3. **No third-party UI component library** in feature code.
4. **Domain data lives in its Context/reducer store**, not duplicated in ad hoc component state.
5. **Do not add Zustand, TanStack Query, React Hook Form, Zod, or date-fns speculatively** — this repo has deliberately not adopted them; introducing one is a decision to raise, not a default.
6. **Use the existing structure** (`app/`, `components/`, `lib/`) — don't invent a new top-level hierarchy.
7. **Design tokens are mandatory** — no hardcoded hex/px values where a token exists; if a needed token isn't bridged into Tailwind yet, bridge it (§4) rather than hardcoding.
8. **Business logic stays out of presentational components.**
9. **Reusable logic is extracted into hooks/utilities** (`lib/*`), not copy-pasted.
10. **Navigation labels/hrefs are not duplicated in JSX** — they come from `SidebarNavLinks.tsx`.
11. **Never report an unexecuted test as passing.**
12. **A feature is not done** until it has loading/empty/error states, is checked in both themes and at mobile/tablet/desktop widths, and has been visually verified (running the app, not just typechecking) — see the existing `ascentware-project` skill's completion checklist, which this elaborates on.

Following this skill keeps `apps/web` consistent with Ascentware's company-wide engineering standards while staying honest about what this specific repo's stack actually is.
