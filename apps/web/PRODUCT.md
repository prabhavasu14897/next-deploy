# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary users are brand/agency social media managers who operate on behalf of multiple client organizations. They work inside an org-scoped workspace: pick or create an organization, connect social platforms to it, and select which pages/accounts under each connected platform are actively managed.

## Product Purpose
Ascentware Social Media Platform is a multi-organization social media management tool. It lets an organization connect social platforms, choose which accounts/pages to manage under each, and — in planned future scope — create AI-assisted content and schedule/publish it across those connections. Success for the current build phase is an org manager adding an organization, connecting a platform to it, and selecting active accounts without engineering involvement.

## Positioning
Two claims a neighboring tool (Buffer, Hootsuite, Later) could not truthfully make here:
1. Social platform integrations are dynamically configurable, not hardcoded — administrators add a new platform through a dedicated Add Platform flow instead of waiting on a code release.
2. AI-assisted content design (image generation, captions, hashtags/tags) is planned as a core capability of the platform, not a bolt-on integration.

## Operating Context
- Multi-tenant: the platform serves multiple organizations; a user's working context is scoped to one organization at a time.
- Within an organization: connect a platform (LinkedIn, Facebook, Instagram initially), then select which pages/accounts under that platform are managed.
- Platform administrators manage the catalog of available platforms via a separate Add Platform area, decoupled from the org-level connect flow — adding a platform to the catalog is distinct from an org connecting to one.
- Initial UI scope: Dashboard, Organizations, Add Platform. Content creation, scheduling, and publishing UI are future scope and not yet built.

## Capabilities and Constraints
- Confirmed: multi-organization structure; admin-configurable platform catalog (not hardcoded); org-to-platform connection with page/account selection.
- Initial platforms: LinkedIn, Facebook, Instagram. These integrations are planned, not yet implemented on the backend — treat connect flows as real UI over not-yet-live integrations, not as fully working today.
- Planned, not yet built: AI content creation, platform-specific image generation, captions, auto-generated hashtags/tags, scheduling, publishing.
- Frontend: Next.js (App Router) with Tailwind CSS v4, already scaffolded (create-next-app default, undesigned). Backend: NestJS, already scaffolded (default Nest starter, no domain code yet).
- Undecided: user roles/permissions model, full list of platforms beyond the initial three, auth approach.

## Brand Commitments
Product name: Ascentware Social Media Platform. No other visual or voice commitments made yet.

## Evidence on Hand
None yet — no real organizations, platform connections, or generated content exist. Future work must not fabricate sample organizations, connected accounts, or generated content as if real; use clearly-labeled placeholder/demo data instead.

## Product Principles
1. Extensibility over hardcoding — every platform-specific piece (auth, connection UI, capabilities shown) must fit the dynamic Add Platform model; never assume LinkedIn/Facebook/Instagram are the only platforms that will ever exist.
2. Org scoping is structural — every screen and flow operates within one organization's context; nothing should implicitly span organizations.
3. Design ahead of build, honestly — UI should express the full connect → select accounts → (future) create/schedule/publish arc even where backend integrations don't exist yet, without ever faking an unimplemented area as live or working.
4. Operate mode — this is a task tool for social managers, not a marketing surface: scanability, consistency, and clarity outrank expressive flourish.
