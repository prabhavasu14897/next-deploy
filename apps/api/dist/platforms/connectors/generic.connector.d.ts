import type { DecryptedPlatform, DiscoveredAccount, PlatformConnector } from './connector.interface.js';
export declare class GenericConnector implements PlatformConnector {
    readonly key = "__generic__";
    connect({ apiBaseUrl, credentials, secretKeys }: DecryptedPlatform): Promise<{
        accounts: DiscoveredAccount[];
    }>;
}
