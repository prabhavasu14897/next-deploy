import type { CredentialField, Platform, PlatformIntegrationConfig } from "./types";

/**
 * SEED PLATFORMS — one-time seed data for lib/platforms/store.tsx's first
 * hydrate (nothing in localStorage yet). The real catalog now lives in that
 * store, admin-editable via the Add Platform surface; this file no longer
 * IS the catalog.
 *
 * Organizations UI must never import a platform id, name, or brand color
 * into a conditional. Every platform-facing component maps over the live
 * catalog (or a subset of it) and renders identically for each entry.
 */
export const SEED_PLATFORMS: Platform[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    summary: "Company pages and showcase pages.",
    accountNoun: "Page",
    accountNounPlural: "Pages",
  },
  {
    id: "facebook",
    name: "Facebook",
    summary: "Pages managed through a Facebook Business account.",
    accountNoun: "Page",
    accountNounPlural: "Pages",
  },
  {
    id: "instagram",
    name: "Instagram",
    summary: "Business and creator accounts.",
    accountNoun: "Account",
    accountNounPlural: "Accounts",
  },
];

/**
 * SEED PLATFORM INTEGRATIONS — the seed data's matching integration configs.
 * A real integration would replace this with actual OAuth client config;
 * the shape (latency, failure rate, discovery volume) is what a real
 * integration record would carry, so swapping mock for real later does not
 * change how Organizations consumes it.
 */
export const SEED_PLATFORM_INTEGRATIONS: Record<string, PlatformIntegrationConfig> = {
  linkedin: {
    platformId: "linkedin",
    authType: "oauth2-mock",
    scopes: ["r_organization_admin", "w_organization_social"],
    simulatedLatencyMsRange: [900, 1800],
    simulatedFailureRate: 0.12,
    accountCountRange: [3, 42],
    credentialFields: [],
    credentials: {},
  },
  facebook: {
    platformId: "facebook",
    authType: "oauth2-mock",
    scopes: ["pages_show_list", "pages_manage_posts"],
    simulatedLatencyMsRange: [1100, 2200],
    simulatedFailureRate: 0.18,
    accountCountRange: [5, 60],
    credentialFields: [],
    credentials: {},
  },
  instagram: {
    platformId: "instagram",
    authType: "oauth2-mock",
    scopes: ["instagram_basic", "instagram_content_publish"],
    simulatedLatencyMsRange: [800, 1600],
    simulatedFailureRate: 0.15,
    accountCountRange: [2, 35],
    credentialFields: [],
    credentials: {},
  },
};

/** Fixed simulation defaults for a platform an admin adds through the UI —
 *  never admin-entered (only credentialFields comes from the admin, via the
 *  Add Platform form's field builder). */
export function createDefaultIntegration(
  platformId: string,
  credentialFields: CredentialField[] = []
): PlatformIntegrationConfig {
  return {
    platformId,
    authType: "oauth2-mock",
    scopes: [],
    simulatedLatencyMsRange: [900, 1800],
    simulatedFailureRate: 0.15,
    accountCountRange: [3, 40],
    credentialFields,
    credentials: {},
  };
}
