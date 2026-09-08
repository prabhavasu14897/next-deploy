import { PrismaService } from '../common/prisma.service.js';
import { EncryptionService } from '../common/encryption.service.js';
import { ConnectorService } from './connectors/connector.service.js';
import type { DiscoveredAccount } from './connectors/connector.interface.js';
export interface CredentialFieldDto {
    key: string;
    label: string;
    secret: boolean;
    value: string;
}
export interface PlatformDto {
    name: string;
    summary: string;
    accountNoun: string;
    accountNounPlural: string;
    apiBaseUrl: string;
    credentialFields: CredentialFieldDto[];
}
export interface CredentialFieldResponse {
    key: string;
    label: string;
    secret: boolean;
    value: string | null;
    hasValue: boolean;
}
export interface PlatformResponse {
    id: string;
    name: string;
    summary: string;
    accountNoun: string;
    accountNounPlural: string;
    apiBaseUrl: string;
    credentialFields: CredentialFieldResponse[];
    createdAt: string;
    updatedAt: string;
}
export declare class PlatformsService {
    private readonly prisma;
    private readonly encryption;
    private readonly connectors;
    constructor(prisma: PrismaService, encryption: EncryptionService, connectors: ConnectorService);
    list(): Promise<PlatformResponse[]>;
    create(dto: PlatformDto): Promise<PlatformResponse>;
    update(id: string, dto: PlatformDto): Promise<PlatformResponse>;
    remove(id: string): Promise<void>;
    connect(id: string): Promise<{
        accounts: DiscoveredAccount[];
    }>;
    private toResponse;
}
