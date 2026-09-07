import { Inject, Injectable } from '@nestjs/common';
import { PUBLISH_PROVIDERS } from './publish-provider.interface.js';
import type { PublishInput, PublishProvider, PublishResult } from './publish-provider.interface.js';
import { PublishProviderNotSupportedException } from './publish.exceptions.js';

@Injectable()
export class PublishService {
  private readonly providers: Map<string, PublishProvider>;

  constructor(@Inject(PUBLISH_PROVIDERS) providers: PublishProvider[]) {
    this.providers = new Map(providers.map((provider) => [provider.key, provider]));
  }

  publish(platformKey: string, input: PublishInput): Promise<PublishResult> {
    const provider = this.providers.get(platformKey.toLowerCase());
    if (!provider) {
      throw new PublishProviderNotSupportedException(platformKey);
    }
    return provider.publish(input);
  }
}
