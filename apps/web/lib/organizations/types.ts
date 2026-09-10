/**
 * Platform Catalog — what platforms exist and what they call the things
 * they manage. This is the seed data a future Add Platform admin surface
 * would maintain; Organizations only ever reads it, never branches on a
 * platform's id or name.
 */
export interface Platform {
  id: string;
  name: string;
  summary: string;
  /** what a discovered connection surfaces, e.g. "Page", "Business account" */
  accountNoun: string;
  accountNounPlural: string;
  /** Where Connect calls to validate credentials when no bespoke backend
   *  integration exists for this platform (see the generic connector). */
  apiBaseUrl: string;
  /** Admin-uploaded icon — a data: URL, same inline-storage approach as an
   *  organization's logo. Takes priority over PlatformBadge's built-in
   *  name-matched brand marks (LinkedIn/Facebook/Instagram) when set.
   *  Frontend-only for now: the backend catalog doesn't persist this field
   *  yet, so it's dropped on a real API refetch — see PlatformBadge. */
  logoDataUrl: string | null;
}

/** One credential field a platform needs to connect — defined by the admin
 *  per platform in the Add Platform form, never hardcoded by this app. */
export interface CredentialField {
  key: string;
  label: string;
  /** Masked input (type="password"); a true value is also encrypted at
   *  rest server-side and never returned to the client once saved (see
   *  the Platforms API — the frontend only ever sees `credentials[key]`
   *  as an empty string or a masked placeholder, never the real secret). */
  secret: boolean;
}

/**
 * Platform Configuration / Integration — how a cataloged platform's mock
 * auth behaves. Kept separate from the catalog entry so the two concerns
 * (what the platform is vs. how connecting to it behaves) can evolve apart.
 */
export interface PlatformIntegrationConfig {
  platformId: string;
  authType: "oauth2-mock";
  scopes: string[];
  simulatedLatencyMsRange: [number, number];
  simulatedFailureRate: number;
  accountCountRange: [number, number];
  /** Defined by the admin when adding this platform — what it takes to
   *  connect (e.g. Client ID / Client Secret), not pre-programmed here. */
  credentialFields: CredentialField[];
  /** Admin-entered values for credentialFields, keyed by CredentialField.key. */
  credentials: Record<string, string>;
}

/** Everything the Add Platform form collects, before an id exists. */
export type PlatformDraft = Omit<Platform, "id"> & {
  credentialFields: CredentialField[];
  credentials: Record<string, string>;
};

export type ConnectionStatus = "not_connected" | "connecting" | "connected" | "error";

/** The organization's own operating status — distinct from ConnectionStatus,
 *  which tracks its relationship to each platform. */
export type OrganizationStatus = "active" | "inactive";

export interface Organization {
  id: string;
  name: string;
  code: string;
  /** A data: URL — this mock app has no upload backend, so the image is
   *  stored inline. Null when no logo was set. */
  logoDataUrl: string | null;
  description: string;
  website: string;
  industry: string;
  country: string;
  timezone: string;
  status: OrganizationStatus;
  createdAt: string;
}

/** A page/account entered by hand in the create wizard, before the
 *  organization (and so a real connectionId) exists. Becomes a real
 *  ManagedAccount via addManualAccounts once the organization is created. */
export interface DraftPage {
  id: string;
  name: string;
  type: string;
  followers: number;
  selected: boolean;
}

/** Everything the create wizard collects, before an id/createdAt exist.
 *  platformIds and platformPages aren't fields on Organization itself:
 *  platformIds is the wizard's "connect these on creation" intent, consumed
 *  by connectPlatform per id right after the organization is created;
 *  platformPages holds any pages typed in for a platform, keyed by platform
 *  id — when present for a platform, addManualAccounts persists them
 *  directly instead of connectPlatform's simulated discovery. */
export type OrganizationDraft = Omit<Organization, "id" | "createdAt"> & {
  platformIds: string[];
  platformPages: Record<string, DraftPage[]>;
};

/** One organization's relationship to one cataloged platform. */
export interface OrganizationPlatformConnection {
  id: string;
  organizationId: string;
  platformId: string;
  status: ConnectionStatus;
  connectedAt: string | null;
  lastError: string | null;
  accountsDiscovered: boolean;
  discoveringAccounts: boolean;
}

/** One account/page a connection discovered, and whether it's managed. */
export interface ManagedAccount {
  id: string;
  connectionId: string;
  organizationId: string;
  platformId: string;
  externalId: string;
  name: string;
  handle: string;
  type: string;
  followers: number;
  selected: boolean;
}
