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
    credentials: Record<string, string>;
    secretKeys: string[];
}
export interface PlatformConnector {
    readonly key: string;
    connect(platform: DecryptedPlatform): Promise<{
        accounts: DiscoveredAccount[];
    }>;
}
export declare const PLATFORM_CONNECTORS: unique symbol;
