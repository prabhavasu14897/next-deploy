---
version: 1
slug: "add-platform"
primary_target: "add-platform"
related_targets: []
---

## Direction contract

THESIS: The catalog is genuinely admin-authored, not a cosmetic listing over a fixed set — no platform name, logo, or required field is pre-known by this app; the surface's whole job is proving that at every step (a free-typed name, a self-defined field builder).

OWN-WORLD: Inherits Organizations' system exactly, as a sibling Operate-mode admin-CRUD surface, not a new world: navy surface ladder, Manrope, primary-blue accent on buttons/focus/active only, translucent-white cards and 1px outlines (Frosted Azure, no shadows), monogram PlatformBadge, the shared Dialog/ConfirmDialog/TextField/FormField vocabulary already built for Organizations.

STORY: An admin scans a table of cataloged platforms, clicks "Add Platform," types its name/summary/account terms, then builds its required connection fields one at a time (label + secret toggle, zero or more — nothing pre-populated), fills in values, saves; the platform is immediately selectable everywhere else in the app (org wizard, org detail). Deleting a platform still in use by an organization is blocked with an explanation.

FIRST VIEWPORT: Persistent shell frames a full-width table mirroring OrganizationsTable's shape (Platform / Summary / Accounts called / Actions), "Add Platform" primary button top-right, monogram badge + name per row, Edit/Delete icon actions, EmptyState row when the catalog is empty.

FORM: Precisely specified narrow request inside an established world — shaped directly per new-work's own exception for this case; no concept-seed roll, since the structure (list+CRUD mirroring OrganizationsTable, a dynamic credential-field builder, a cross-store delete-guard) was already fully settled with the user before this invocation, same as the organizations brief's own precedent for a pinned brief.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
