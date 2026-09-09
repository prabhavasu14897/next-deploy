### Purpose

Update the white-label foundation (`@enterprise/config`) and design tokens (`DESIGN.md`, `.impeccable/design.json`) for a new client project. This command transitions the generic enterprise starter into a client-specific branded application.

### Workflow

1. **Collect Client Context**: Ask the user for the new client's brand name, primary color, typography preferences, and overall aesthetic goals (e.g., "warm and playful", "strict and corporate").
2. **Update Config**: Modify `packages/config/src/index.ts` to reflect the new client's `orgConfig.name`, `orgConfig.legalName`, and `orgConfig.branding.primaryColor`.
3. **Regenerate Design Tokens**: Update `DESIGN.md` and `.impeccable/design.json` using the `$impeccable document` standard, ensuring the visual world aligns with the new client's identity.
4. **Refine UI Kit**: Run a targeted `$impeccable refine` or manual update over `packages/ui-kit/src/components` to ensure the component scale (paddings, radii, font sizes) matches the new client's design direction (e.g., tightening up for dense data apps, loosening for consumer apps).
5. **Verify**: Ensure the client shells (`apps/web-client`, `apps/web-admin`) correctly inherit the new branding via the CSS variable injection (`var(--brand-color)`).
