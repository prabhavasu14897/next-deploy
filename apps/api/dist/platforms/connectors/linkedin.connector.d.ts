import type { DecryptedPlatform, DiscoveredAccount, PlatformConnector } from './connector.interface.js';
export declare class LinkedInConnector implements PlatformConnector {
    readonly key = "linkedin";
    connect({ credentials }: DecryptedPlatform): Promise<{
        accounts: DiscoveredAccount[];
    }>;
}
