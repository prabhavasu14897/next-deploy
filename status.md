# Status — LinkedIn Demo & Post Wizard

Last updated: 2026-09-11

## Current status: working

Real end-to-end LinkedIn posting is confirmed working locally:

1. `apps/api` runs locally on `:4000`, `apps/web` on `:3000` (`NEXT_PUBLIC_API_URL=http://localhost:4000` in `apps/web/.env.local`).
2. Add Platform → edit **LinkedIn** → **Connect with LinkedIn** completes LinkedIn's real OAuth consent screen and saves a real Access Token + Organization/Person URN.
3. Post wizard generates real content (free image via Pollinations.ai, local-template captions/hashtags — see Issue 6) and publishes for real to LinkedIn.
4. Post History shows the result as `LinkedIn · posted`, and the **Link** icon opens the actual live LinkedIn post.

**Scope right now**: posting to the connected member's own **personal profile** (`w_member_social` scope), not a company/organization page — the LinkedIn Developer App doesn't have the "Community Management API" product approved yet (needs LinkedIn review). See Open items.

## Issues found & fixed (so these don't get re-debugged)

1. **LinkedIn platform had the wrong credential fields.** Symptom: Connect dialog listed "Client ID, Client Secret, redirect URL, post api, Authorization URL, Token URL" and failed with "LinkedIn isn't configured yet." Root cause: the backend's LinkedIn connector/provider only ever read two specific keys — `access-token` and `organization-urn` — not a generic OAuth-app credential set. Fix: built a real OAuth flow (see Issue 2) that populates those two fields automatically; the Client ID/Client Secret fields are legitimately still needed (see Issue 2), the other four (redirect URL, post api, Authorization URL, Token URL) are unused/obsolete now that the app builds those internally.

2. **No way to actually obtain an Access Token/Organization URN.** Built a real "Connect with LinkedIn" OAuth 2.0 flow: `apps/api/src/platforms/oauth/linkedin-oauth.{service,controller}.ts`. Reads Client ID/Secret from the LinkedIn platform's own credential fields, redirects to LinkedIn's consent screen, exchanges the returned code for a token, and saves the result. Registered redirect URL (must match exactly what's configured in the LinkedIn Developer Portal): `http://localhost:4000/platforms/oauth/linkedin/callback`.

3. **`client-id` field is also encrypted (`secret: true`), not just `client-secret`.** An early version of the OAuth service only decrypted `client-secret` before use, which would have sent ciphertext as the literal Client ID. Fixed via a shared `fieldValue()` helper in `linkedin-oauth.service.ts` that always checks the `secret` flag before using any field's value.

4. **Requested OAuth scopes didn't match what the LinkedIn app is actually approved for.** Symptom: LinkedIn's own "Bummer, something went wrong" error page, then a clean `Scope "w_organization_social" is not authorized for your application` error once the redirect URL was fixed. Root cause: the app only has the default scopes (`openid`, `profile`, `w_member_social`, `email`) — organization-posting scopes (`w_organization_social`, `r_organization_social`, `rw_organization_admin`) need LinkedIn's "Community Management API" product, which requires separate review. Fix: scoped the OAuth request down to `openid profile w_member_social`, and added a fallback in `lookupAuthorUrn()` that tries an organization lookup first (harmless no-op without that scope) then falls back to the member's own profile URN via `GET /v2/userinfo`. `linkedin.connector.ts`'s Connect-validation step branches the same way based on URN prefix (`urn:li:person:` vs `urn:li:organization:`). **`linkedin.provider.ts` (the actual publish code) needed no changes** — LinkedIn's Posts/Images APIs accept either URN type interchangeably in the `author`/`owner` fields.

5. **Publish failed with `426 NONEXISTENT_VERSION — Requested version 20240101 is not active`.** Root cause: the hardcoded `LinkedIn-Version` header (`202401`) had expired — LinkedIn supports each version for a minimum of 2 years from release. Fix: bumped to `202608` in all three places it's hardcoded: `apps/api/src/publish/providers/linkedin.provider.ts`, `apps/api/src/platforms/connectors/linkedin.connector.ts`, `apps/api/src/platforms/oauth/linkedin-oauth.service.ts`. **This will need bumping again periodically** — LinkedIn's version format is `YYYYMM`.

6. **AI generation ("AI generation isn't configured yet") with no `OPENAI_API_KEY` set locally.** Fixed with an automatic fallback in `apps/api/src/ai/ai.service.ts`: real free image generation via Pollinations.ai (works reliably, no key needed), and local template-based captions/hashtags/rewrites (Pollinations' text API turned out to require a funded key for any non-cached prompt and rate-limits anonymous callers to 1 concurrent request — not viable for a live demo). Both automatically switch to real OpenAI the moment `OPENAI_API_KEY` is set — no config changes needed later.

7. **Post wizard let you race past the Editor step before generation finished**, landing on Publish with "No platform is ready to publish yet" even though nothing was actually wrong. Root cause: the wizard's Continue button and step-pills were only gated on a post existing, not on generation (`status === "ready"`) having actually completed (~5s async). Fixed in `apps/web/components/posts/PostWizard.tsx` — Continue and the Preview/Publish pills now stay disabled (with the existing generation spinner visible) until at least one draft reaches `"ready"`.

8. **Post History gave no way to recover a stuck post.** A `"ready"` post never published, or a `"failed"` publish attempt, had no action besides Delete. Fixed in `apps/web/components/posts/PostHistoryTable.tsx` + `lib/posts/store.tsx`: `submitPost` now (re)publishes `"ready"`, `"draft"`, and `"failed"` drafts alike; a send-icon action appears for all three; hovering a `"failed"` badge shows the real error message (also fixed: LinkedIn's HTML-entity-encoded error text like literal `&quot;` now decodes properly).

9. **Post History's Link column just opened the raw generated image**, even for a real published post. Fixed: for a `"posted"` LinkedIn draft, it now links to the real permalink (`https://www.linkedin.com/feed/update/{externalPostId}/`, per LinkedIn's docs) instead. Other platforms (Facebook) still show the image thumbnail — their permalink format isn't confirmed yet.

## Open items

- **Company/organization page posting** is not available yet — needs LinkedIn's "Community Management API" product approved for the Developer App (external review, not something to fix in code). The code already prefers an organization URN automatically if that scope is ever added back — no further changes needed on our side once LinkedIn approves it.
- **Production Vercel deployment is not part of this flow** — `apps/web`'s live `NEXT_PUBLIC_API_URL` is still misconfigured (`localhost:8080`), and the deployed `apps/api` sits behind Vercel's SSO Deployment Protection. Both are fine for local-only demo use; would need fixing before any of this works on the public URL.
- **Azure DevOps credential rotation** (unrelated, from an earlier session) — still never confirmed done by the user.
- The `LINKEDIN_VERSION` constant (`202608`) will expire again in the future — bump it in all three files listed in Issue 5 when it does.
