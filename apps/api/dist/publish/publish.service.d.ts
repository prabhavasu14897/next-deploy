import type { PublishInput, PublishProvider, PublishResult } from './publish-provider.interface.js';
import { PrismaService } from '../common/prisma.service.js';
import { EncryptionService } from '../common/encryption.service.js';
export declare class PublishService {
    private readonly prisma;
    private readonly encryption;
    private readonly providers;
    constructor(providers: PublishProvider[], prisma: PrismaService, encryption: EncryptionService);
    publish(platformKey: string, input: Omit<PublishInput, 'credentials'>): Promise<PublishResult>;
    private resolveCredentials;
}
