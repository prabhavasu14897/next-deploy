import { PlatformsService, type CredentialFieldDto } from './platforms.service.js';
declare class CredentialFieldBody implements CredentialFieldDto {
    key: string;
    label: string;
    secret: boolean;
    value: string;
}
declare class PlatformBody {
    name: string;
    summary: string;
    accountNoun: string;
    accountNounPlural: string;
    apiBaseUrl: string;
    credentialFields: CredentialFieldBody[];
}
export declare class PlatformsController {
    private readonly platformsService;
    constructor(platformsService: PlatformsService);
    list(): Promise<import("./platforms.service.js").PlatformResponse[]>;
    create(body: PlatformBody): Promise<import("./platforms.service.js").PlatformResponse>;
    update(id: string, body: PlatformBody): Promise<import("./platforms.service.js").PlatformResponse>;
    remove(id: string): Promise<void>;
    connect(id: string): Promise<{
        accounts: import("./connectors/connector.interface.js").DiscoveredAccount[];
    }>;
}
export {};
