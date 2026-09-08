import type { DecryptedPlatform, DiscoveredAccount, PlatformConnector } from './connector.interface.js';
export declare class FacebookConnector implements PlatformConnector {
    readonly key = "facebook";
    connect({ credentials }: DecryptedPlatform): Promise<{
        accounts: DiscoveredAccount[];
    }>;
}
