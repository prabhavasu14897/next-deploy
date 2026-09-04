---
name: Ascentware Social Media Platform
description: Luminous Dark — a high-contrast dark theme anchored on an architectural, vibrant blue.
colors:
  surface: "#00161f"
  surface-dim: "#00161f"
  surface-bright: "#243c47"
  surface-container-lowest: "#001018"
  surface-container-low: "#031e28"
  surface-container: "#08222d"
  surface-container-high: "#142d37"
  surface-container-highest: "#1f3843"
  surface-variant: "#1f3843"
  on-surface: "#cce6f4"
  on-surface-variant: "#bdc8cf"
  inverse-surface: "#cce6f4"
  inverse-on-surface: "#1b333e"
  outline: "#879299"
  outline-variant: "#3e484e"
  surface-tint: "#6dd2ff"
  primary: "#6dd2ff"
  on-primary: "#003547"
  primary-container: "#2bb3e4"
  on-primary-container: "#004157"
  inverse-primary: "#006686"
  secondary: "#c6c6c7"
  on-secondary: "#2f3131"
  secondary-container: "#454747"
  on-secondary-container: "#b4b5b5"
  tertiary: "#97ceee"
  on-tertiary: "#003549"
  tertiary-container: "#77aecd"
  on-tertiary-container: "#004159"
  error: "#ffb4ab"
  on-error: "#690005"
  error-container: "#93000a"
  on-error-container: "#ffdad6"
  primary-fixed: "#bfe8ff"
  primary-fixed-dim: "#6dd2ff"
  on-primary-fixed: "#001f2a"
  on-primary-fixed-variant: "#004d65"
  background: "#00161f"
  on-background: "#cce6f4"
  status-success: "#7fe0a6"
  status-success-container: "#123d2b"
  status-pending-accent: "#f2c078"
  status-pending-accent-container: "#3d2f10"
typography:
  headline-lg:
    fontFamily: "Manrope, ui-sans-serif, system-ui"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: "48px"
    letterSpacing: "-0.02em"
  headline-lg-mobile:
    fontFamily: "Manrope, ui-sans-serif, system-ui"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: "36px"
    letterSpacing: "-0.02em"
  headline-md:
    fontFamily: "Manrope, ui-sans-serif, system-ui"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "32px"
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Manrope, ui-sans-serif, system-ui"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "24px"
  subtitle:
    fontFamily: "Manrope, ui-sans-serif, system-ui"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: "22px"
  body-lg:
    fontFamily: "Manrope, ui-sans-serif, system-ui"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28px"
  body-md:
    fontFamily: "Manrope, ui-sans-serif, system-ui"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  label-md:
    fontFamily: "Manrope, ui-sans-serif, system-ui"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
    letterSpacing: "0.01em"
  label-sm:
    fontFamily: "Manrope, ui-sans-serif, system-ui"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
    letterSpacing: "0.05em"
  micro:
    fontFamily: "Manrope, ui-sans-serif, system-ui"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: "12px"
    letterSpacing: "0.04em"
rounded:
  sm: "0.125rem"
  DEFAULT: "0.25rem"
  md: "0.375rem"
  lg: "0.5rem"
  xl: "0.75rem"
  full: "9999px"
spacing:
  unit: "4px"
  gutter: "24px"
  margin-desktop: "64px"
  margin-mobile: "16px"
  container-max: "1200px"
components:
  button-primary:
    backgroundColor: "#ffffff"
    textColor: "{colors.on-primary-fixed-variant}"
    rounded: "{rounded.DEFAULT}"
    padding: "0 14px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "rgb(255 255 255 / 0.9)"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.DEFAULT}"
    padding: "0 14px"
    height: "36px"
  input-field:
    backgroundColor: "{colors.surface-container-high}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.DEFAULT}"
    height: "36px"
    padding: "0 10px"
---

# Design System: Ascentware Social Media Platform

## Overview

**Creative North Star: "Luminous Dark"**

A high-contrast dark mode anchored on a vibrant, architectural blue. The brand personality is precise, technical, and high-energy — built for professionals who need a focused environment that feels both cutting-edge and structurally sound. The aesthetic blends minimalism with a technological glow: a near-black navy base (`#00161f`) holds the interface, and a saturated cyan-blue (`primary` `#6dd2ff`, `primary-container` `#2bb3e4`) carries every point of emphasis — CTAs, active states, focus rings, the current selection. The emotional register is clarity and digital sophistication: intense saturation used sparingly to mark what matters, extreme legibility everywhere else.

**Resolving one tension in the brief as given:** the source spec's prose describes primary blue as "the foundational background for large surface areas," while its own token export defines `background`/`surface` as the near-black navy and reserves `primary`/`primary-container` as accent roles (the conventional Material-3 pattern this token set is built on). This system follows the token export as normative — dark navy is the base, vibrant blue is the accent — because a literal all-blue background would fight the same export's high-contrast-legibility goal and isn't how any of its own component specs (white-on-navy buttons, navy recessed inputs, frosted-white cards) actually read. Large *accent* surfaces (the primary button, the active org's highlighted row, the current-org chip) do use the vibrant blue at full saturation, which is where the brief's "luminous" character actually shows up.

Text contrast is strictly managed: `on-surface` (near-white, `#cce6f4`) for primary content, `on-surface-variant` (`#bdc8cf`) for secondary/metadata — no muddy greys.

**Key Characteristics:**
- Near-black navy base (`surface` family) with a saturated cyan-blue accent (`primary`/`primary-container`) — dark mode, not an inverted light theme
- Manrope throughout, weights pushed toward semi-bold/bold for headings to keep white text crisp against dark surfaces
- "Frosted Azure" elevation: translucent white fills and 1px white-opacity outlines stand in for shadows, never a colored drop shadow
- Cards and list rows, not the old world's strips — this replaces a prior kraft-paper/graphite direction outright, not an extension of it
- One persistent app shell (sidebar + header) carries navigation; page content is the accent-and-card system described here

## Colors

Material-3-shaped role names (surface tiers, primary/secondary/tertiary, fixed variants) so the token set stays traceable to a standard dark-theme structure, plus two small app-specific extensions for connection status.

### Primary
- **Primary Blue** (`#6dd2ff`, on-primary `#003547`, container `#2bb3e4`, on-container `#004157`): buttons' active affordance color, focus rings, links, the current-organization highlight and its chip. This is the system's one saturated color — used for emphasis, not as a fill for large passive areas.

### Secondary
- **Secondary Grey** (`#c6c6c7`, on-secondary `#2f3131`, container `#454747`): reserved for muted UI chrome that needs to read as neutral-but-present rather than fully backgrounded; not yet in active use on the Organizations surface.

### Tertiary
- **Tertiary Sky** (`#97ceee`, on-tertiary `#003549`, container `#77aecd`): a cooler secondary accent, held in reserve for a future surface that needs to distinguish itself from the primary blue's CTA meaning (e.g., informational callouts).

### Neutral (surface tiers)
- **Surface** (`#00161f`) → **Surface Container Lowest** (`#001018`) → **Low** (`#031e28`) → **DEFAULT** (`#08222d`) → **High** (`#142d37`) → **Highest** (`#1f3843`): the elevation ladder. Page background sits at `surface`; the sidebar and header sit at `surface-container-lowest` (recessed, one step darker than page content); dialogs and slide-over panels sit at `surface-container-high`; recessed inputs sit at `surface-container-high` too, reading as punched-in relative to their card.
- **On-Surface** (`#cce6f4`) / **On-Surface Variant** (`#bdc8cf`): primary and secondary text, respectively.
- **Outline** (`#879299`) / **Outline Variant** (`#3e484e`): borders — outline for interactive/dashed affordances, outline-variant for structural dividers (sidebar/header rules).

### Status extensions (not in the source token set)
- **Status Success** (`#7fe0a6`, container `#123d2b`): connected. Tuned to the same luminance class as primary so it reads as one family with it.
- **Status Pending Accent** (`#f2c078`, container `#3d2f10`): connecting/pending — a warm counterpoint to the cool primary blue, kept distinct from it.
- **Error** (`#ffb4ab`, on-error `#690005`, container `#93000a`): the source spec's own error role, used as-is for connection failures.

### Named Rules
**The Accent, Not Ambient, Rule.** Primary blue marks emphasis — buttons, focus, the current selection — never a full-page or full-panel background. Large surfaces stay on the neutral surface ladder; saturation is spent where it means something.

**The Outline Over Shadow Rule.** Depth comes from translucent white fills and 1px white-opacity borders ("Frosted Azure"), not colored drop shadows — a dark-on-dark shadow reads as dirty, an outline reads as precise.

## Typography

**Font:** Manrope (self-hosted via `next/font/google`, weights 400/500/600/700) — the only face in the system; no separate mono/data face. Tabular alignment is handled by the `.tabular` utility (`font-variant-numeric: tabular-nums`), which Manrope supports natively.

**Character:** Geometric and modern, with tight letter-spacing on headlines (-0.01 to -0.02em) for a compact, technical read. Headline weights sit a step heavier than a typical scale (600–700 rather than 400–500) so white text keeps its edge against dark surfaces — the source brief's "prevent thinning" instruction, applied here even though the base is dark rather than the brief's literal saturated-blue ground.

### Hierarchy
- **Headline LG** (700, 40px/48, -0.02em) — reserved; no surface built yet needs a hero-scale headline.
- **Headline LG Mobile** (700, 30px/36, -0.02em) — the mobile companion to the above, same reservation.
- **Headline MD** (600, 24px/32, -0.01em): page-level `<h1>` — "Organizations," "Dashboard," "Add Platform."
- **Title** (600, 18px/24) — *extension, size shared with body-lg, weight raised for heading use*: slide-over panel headings (org name in the detail sheet, the account-picker's platform heading) and the org name's inline rename field.
- **Subtitle** (700, 16px/22) — *extension, size shared with body-md, weight raised for heading use*: compact dialog titles (Connect/Reconnect, delete confirmation).
- **Body LG** (400, 18px/28): reserved for longer-form paragraph copy; not yet used on Organizations, which favors compact rows over prose.
- **Body MD** (400, 16px/24): header subtitles/descriptions under a page `<h1>` — the one sentence explaining what the page is for.
- **Label MD** (600, 14px/20, 0.01em): the workhorse size — button text, row/list-item titles (org name in its strip, platform name, account name), nav links.
- **Label SM** (500, 12px/16, 0.05em): *tracking applies to genuinely uppercase labels only* — "PLATFORMS," "THIS WILL ALLOW ACCESS TO," filter chips. Also doubles, without the uppercase transform, as **Caption**: regular-weight metadata prose (timestamps, connection counts, scope lists, helper and empty-state text) at the same 12px size.
- **Micro** (700, 10px/12, 0.04em) — *extension, below the source ramp's 12px floor*: the "Current" chip label only. Icon-adjacent glyphs (the platform-badge monogram, the brand lettermark) are sized to their container rather than bound to this ramp, the same way an icon's pixel size isn't a type-scale decision.

### Named Rules
**The Weight-Over-Size Rule.** Where a heading needs to sit at a size the ramp already uses for body copy (Title at 18px, Subtitle at 16px), raise the weight instead of inventing a new size — Title and Subtitle exist for exactly this.

## Layout

**Grid:** desktop content sits in a `max-w-[1200px]` column (the spec's `container-max`), `px-16` (64px, `margin-desktop`) on `sm:` and up, `px-4` (16px, `margin-mobile`) below it. Row/section gaps use the 24px gutter (`gap-6`) or the 4px base unit's multiples for tighter groupings. **Exception:** the Organizations surface (list/grid and the create wizard) runs full-width instead — a table with Name/Platforms/Status/Actions columns and a two-column form both read better using the space beside the sidebar rather than centering in a capped column. The `CreateOrganizationWizard`'s own form still caps at `max-w-2xl` internally so its fields don't stretch unreadably wide.

**Shell:** a persistent app shell — 224px left sidebar (icon + label links, collapsible to a 64px icon rail via the header's hamburger toggle) plus a 56px top header (hamburger + brand lockup left, settings/account icons right) plus a 44px footer — all three pinned to `surface-container-lowest`, one tier darker than page content, so the shell always reads as chrome rather than content. The header spans full width above the sidebar+content row; the footer spans full width below it. Below `sm:`, the sidebar collapses into a left-edge slide-over drawer opened by a header hamburger.

**Page content:** each surface's own canvas holds cards and list rows. Organization rows are individually bordered, translucent-white cards (`bg-white/[0.04]`, `border-white/15`, `rounded-lg`) stacked with `space-y-2` — not a multi-column grid; platform rows and account rows inside a panel are plain list items separated by 10%-white hairlines, per the spec's own List component.

**Overlays:** slide-over panels (org detail, account picker) enter from the right at `max-w-lg`/`max-w-md`, `surface-container-high`, over a `surface-container-lowest/70` scrim. Centered dialogs (connect authorization, delete confirmation) are reserved for single-decision moments ≤ ~24rem wide, `surface-container-high/95` with a backdrop-blur for genuine "frosted glass" character.

## Elevation & Depth

Tonal inversion, not shadows, per the source spec: because the interface leans dark-on-dark, a colored drop shadow reads as dirty rather than deep. Depth comes from three devices instead:

1. **Recessed layers**: inputs and wells use `surface-container-high`/`highest` against their parent's lower tier — a "punched-in" tonal step rather than an inset shadow.
2. **Raised layers**: dialogs use `surface-container-high/95` with `backdrop-blur-md`; the "Frosted Azure" glass character the spec describes, adapted from its literal "10% white over vibrant blue" to "translucent surface-tone over near-black," since the base is dark navy here rather than a lit blue field.
3. **Outlines**: every elevated or interactive boundary — cards, dialogs, panels, dashed empty-states — carries a 1px `outline`/`outline-variant`/`white-opacity` border instead of a shadow. This is the system's primary depth signal.

### Shadow Vocabulary
- **Panel lift** (`box-shadow: -16px 0 40px -12px rgba(0,0,0,0.5)` / mirrored for the left-edge mobile drawer): the one place an actual (near-black, low-opacity) shadow ships — separating a slide-over panel from the dimmed page behind it, layered under its own outline border.

### Named Rules
**The Outline Over Shadow Rule.** (Restated from Colors, since it governs this section directly.) A colored or soft drop shadow never stands in for structure — borders and tonal steps do that work.

## Shapes

Soft, precise rounding per the source spec: base radius `0.25rem` (4px) on buttons and inputs for a crisp, engineered profile; large containers (cards, dialogs, slide-over panels, the empty-state well) step up to `rounded-lg` (0.5rem/8px) for a clearer structural boundary. Pills (`rounded-full`) are reserved for chips and status pills only — never a general container shape.

Icon-scale glyphs (platform-badge monogram, brand lettermark) are simple circles/rounded-squares, not drawn illustrations — geometric shapes matching the "Architectural" character, no hand-inked or textured treatment (that belonged to a prior, now-replaced world).

## Components

### Buttons
- **Shape:** 4px radius, 36px height (`md`) or 28px (`sm`).
- **Primary:** solid white fill, bold blue text (`on-primary-fixed-variant` `#004d65`) — the spec's literal primary-button spec. Hover dims to 90% white, active to 80%.
- **Secondary:** white/40%-opacity ghost border, `on-surface` text, transparent fill, hover washes to `white/10`.
- **Danger:** `error`-toned outline and text — destructive confirmation only (Delete organization).
- **Ghost:** no border, `on-surface-variant` text darkening to `on-surface` on hover.
- **Icon buttons:** 32px square, one tone (the shell's `surface-container-lowest` context covers header/sidebar; content-area icon buttons sit on cards and read fine against the same neutral tone).

### Chips
- **Filter chip** (AccountPicker type filter): pill-shaped, active state is solid `primary` fill with `on-primary` text; inactive is transparent with an `outline-variant` ring.
- **"Current" chip**: solid `primary` fill, `on-primary` text, full-round, Micro-sized (10px) uppercase — marks the active organization.
- **Status pill**: pill-shaped, colored text on a matching low-opacity container tint (success/pending/error/neutral-surface), per connection state.

### Tables (Catalog Lists)
- **Container:** wraps in a `rounded-lg` (8px), `border-white/15` box with `overflow-hidden`; horizontal scroll (`overflow-x-auto`) below the table's `min-w` on narrow viewports.
- **Header row:** `bg-white/[0.03]`, `border-b border-white/10`, cells are Label SM (12px, uppercase, tracked 0.05em) in `on-surface-variant`; the trailing Actions column right-aligns.
- **Body rows:** `border-b border-white/[0.06]` hairlines between rows, no border after the last (`last:border-b-0`); hover brightens to `white/[0.04]` — the same "brighten, don't recolor" rule as Cards and Lists.
- **Empty state:** a single full-width cell renders the shared `EmptyState` (title + description) instead of a header-only table.
- Shared by `OrganizationsTable` and `PlatformsTable` — the same shape (borders, header treatment, row hover, icon-button actions column), not a one-off; this is the system's table pattern for any future admin-catalog surface.

### Cards (Org Strip)
- **Corner style:** `rounded-lg` (8px).
- **Fill:** `white/[0.04]` at rest, `white/[0.08]` on hover — the "brighten, don't recolor" hover rule. The active/current organization's card instead tints toward `primary/10`, brightening to `primary/15` on hover, so "current" reads as a distinct state from ordinary hover.
- **Border:** `white/15` at rest, `primary/40` when active — no shadow (see Elevation & Depth).
- **Internal padding:** `px-4 py-3.5`.

### Lists (Platform Rows, Account Rows)
- **Separator:** thin `white/10` (platform rows) or `white/[0.06]` (account rows) hairlines between items, no separator after the last.
- **Hover:** account rows brighten to `white/[0.06]` on hover — background brightens, never recolors, per the spec's own Lists guidance.

### Inputs / Fields
- **Style:** `surface-container-high` recessed background, `outline-variant` 1px border, 4px radius, 36px height.
- **Focus:** border turns white (the spec's literal instruction), alongside the global `focus-visible` outline ring in `primary`.

### Checkboxes (Account Selection)
- **Unselected:** `outline`-toned border, transparent fill.
- **Selected:** solid white fill with a deep-blue (`on-primary-fixed-variant`) checkmark — the spec's literal "pure white when active, deep navy check" instruction.

### Credential Field Row (Dynamic Field Builder)
A compact, nested card row for building an arbitrary-length list of admin-defined key/value pairs — introduced by the Add Platform surface's credential builder, but the pattern is generic ("let the user define N of something") and worth reusing anywhere a form needs an open-ended list rather than a fixed set of fields.
- **Shape:** `border border-white/15`, `bg-white/[0.04]` fill — the same translucent-card fill/border convention as Cards, but at the smaller `rounded` (4px) radius rather than `rounded-lg`, since the row nests inside a dialog rather than standing as a page-level container.
- **Contents:** a Field Name `Input` and a Value `Input` (`type="password"` when the row is marked secret) side by side, a Secret `Checkbox` + label, and a trailing Remove `IconButton` — all drawn from the existing Input/Checkbox/IconButton vocabulary, no new field primitives.
- **Add:** a secondary-style `Button` ("Add field") appends an empty row; nothing is pre-populated from a hardcoded platform list — every field is admin-authored.

### Navigation (App Shell)
- **Sidebar** (`Sidebar.tsx`, `sm:` and up): 224px fixed column, `surface-container-lowest`, icon + label links (`Dashboard`/`Organizations`/`Add Platform`), active link on a `primary/15` tint with `primary`-colored text and icon. Collapses to a 64px icon-only rail (labels drop to `sr-only`) via the header's hamburger toggle; `open` state lives in `AppShell`.
- **Mobile drawer** (`MobileSidebarDrawer.tsx`, below `sm:`): the sidebar's small-screen form, a left-edge slide-over opened by the header's hamburger.
- **Top header** (`TopHeader.tsx`): 56px bar, `surface-container-lowest`, mobile hamburger (`sm:hidden`, opens the drawer) + desktop hamburger (`hidden sm:flex`, collapses the sidebar rail) + brand lockup left, settings icon + account avatar right — both intentional placeholders; no settings/profile surface exists yet, so neither routes anywhere.
- **Footer** (`Footer.tsx`): 44px bar, `surface-container-lowest`, full width beneath the sidebar+content row, centered muted copyright line. The shell's third persistent region alongside Sidebar and TopHeader.
- **Brand lettermark** (`BrandMark.tsx`): a 24px rounded-square in `primary` holding a bold "A" in `on-primary` — clean and geometric, not a drawn illustration.

## Do's and Don'ts

### Do:
- **Do** use Manrope at the documented weight for every size step; don't introduce a second face.
- **Do** spend `primary` blue on emphasis only — buttons, focus, the current-item state — never as a passive background fill.
- **Do** use outlines and tonal surface steps for depth; reserve the one shadow token for slide-over panels only.
- **Do** raise weight rather than size when a heading needs to share a body size step (Title at 18px, Subtitle at 16px).
- **Do** keep numeric list data (dates, counts, follower figures) in `.tabular`.

### Don't:
- **Don't** fill a large surface (a full page, a full panel) with saturated primary blue — that reads as the brief's prose taken too literally against its own token export; accent, don't flood.
- **Don't** add a colored or soft drop shadow to a card, row, or badge — outlines and tonal steps do that work.
- **Don't** revive the prior kraft-paper/graphite/grease-pencil world's motifs (die-cut clip shapes, hand-inked wobble) — this is a full replacement, not a variant.
- **Don't** add a second sidebar, a second footer, or per-surface navigation. The sidebar plus top header plus footer (`AppShell`) is the system's one persistent chrome.
- **Don't** introduce a fifth status color; reuse the success/pending/error/neutral-surface set for any new connection or health indicator.
