export interface DiscoveredAccount {
  externalId: string;
  name: string;
  handle: string;
  type: string;
  followers: number;
}

export interface DecryptedPlatform {
  id: string;
  name: string;
  apiBaseUrl: string;
  /** Decrypted values, keyed by credential field key. */
  credentials: Record<string, string>;
  /** Which credential field keys are marked secret — the generic
   *  connector uses the first of these as its Bearer token. */
  secretKeys: string[];
}

/** One real "establish connection" integration. `key` matches a platform's
 *  catalog name, lowercased — same registry pattern as
 *  src/publish/publish-provider.interface.ts's PublishProvider. A platform
 *  without a bespoke connector falls back to GenericConnector. */
export interface PlatformConnector {
  readonly key: string;
  connect(platform: DecryptedPlatform): Promise<{ accounts: DiscoveredAccount[] }>;
}

export const PLATFORM_CONNECTORS = Symbol('PLATFORM_CONNECTORS');
