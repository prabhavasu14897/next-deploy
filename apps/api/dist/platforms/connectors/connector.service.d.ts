import type { DecryptedPlatform, DiscoveredAccount, PlatformConnector } from './connector.interface.js';
import { GenericConnector } from './generic.connector.js';
export declare class ConnectorService {
    private readonly generic;
    private readonly connectors;
    constructor(connectors: PlatformConnector[], generic: GenericConnector);
    connect(platformKey: string, platform: DecryptedPlatform): Promise<{
        accounts: DiscoveredAccount[];
    }>;
}
