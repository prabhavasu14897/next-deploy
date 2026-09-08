import { Inject, Injectable } from '@nestjs/common';
import { PUBLISH_PROVIDERS } from './publish-provider.interface.js';
import type { PublishInput, PublishProvider, PublishResult } from './publish-provider.interface.js';
import { PublishProviderNotSupportedException } from './publish.exceptions.js';
import { PrismaService } from '../common/prisma.service.js';
import { EncryptionService } from '../common/encryption.service.js';
import { ProviderNotConfiguredException } from '../common/provider-exceptions.js';

@Injectable()
export class PublishService {
  private readonly providers: Map<string, PublishProvider>;

  constructor(
    @Inject(PUBLISH_PROVIDERS) providers: PublishProvider[],
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
  ) {
    this.providers = new Map(providers.map((provider) => [provider.key, provider]));
  }

  async publish(platformKey: string, input: Omit<PublishInput, 'credentials'>): Promise<PublishResult> {
    const provider = this.providers.get(platformKey.toLowerCase());
    if (!provider) {
      throw new PublishProviderNotSupportedException(platformKey);
    }

    const credentials = await this.resolveCredentials(platformKey);
    return provider.publish({ ...input, credentials });
  }

  // Credentials now live in the Platforms database, encrypted — resolved
  // here server-side rather than trusting a value the browser sent, which
  // is what the request body carried before that database existed.
  private async resolveCredentials(platformKey: string): Promise<Record<string, string>> {
    const platforms = await this.prisma.platform.findMany({ include: { credentialFields: true } });
    const platform = platforms.find((p) => p.name.toLowerCase() === platformKey.toLowerCase());
    if (!platform) {
      throw new ProviderNotConfiguredException(
        `No "${platformKey}" platform is set up in Add Platform yet.`,
      );
    }

    const credentials: Record<string, string> = {};
    for (const field of platform.credentialFields) {
      credentials[field.key] = field.secret && field.value ? this.encryption.decrypt(field.value) : field.value;
    }
    return credentials;
  }
}
