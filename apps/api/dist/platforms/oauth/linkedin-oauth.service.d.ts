import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma.service.js';
import { EncryptionService } from '../../common/encryption.service.js';
export declare class LinkedInOAuthService {
    private readonly prisma;
    private readonly encryption;
    private readonly config;
    private readonly pending;
    constructor(prisma: PrismaService, encryption: EncryptionService, config: ConfigService);
    private apiUrl;
    private appUrl;
    private redirectUri;
    private fieldValue;
    buildAuthorizeUrl(platformId: string): Promise<string>;
    handleCallback(query: {
        code?: string;
        state?: string;
        error?: string;
        error_description?: string;
    }): Promise<string>;
    private exchangeAndStore;
    private lookupAuthorUrn;
    private lookupOrganizationUrn;
    private lookupPersonUrn;
    private upsertCredentialField;
    private sweepExpired;
}
