import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderError, ProviderNotConfiguredException } from '../../common/provider-exceptions.js';
import type { PublishInput, PublishProvider, PublishResult } from '../publish-provider.interface.js';

// Facebook Graph API version — bump when real tokens are tested against it.
const GRAPH_VERSION = 'v21.0';

@Injectable()
export class FacebookProvider implements PublishProvider {
  readonly key = 'facebook';

  constructor(private readonly config: ConfigService) {}

  async publish({ imageBase64, caption }: PublishInput): Promise<PublishResult> {
    const accessToken = this.config.get<string>('FACEBOOK_PAGE_ACCESS_TOKEN');
    const pageId = this.config.get<string>('FACEBOOK_PAGE_ID');
    if (!accessToken || !pageId) {
      throw new ProviderNotConfiguredException(
        "Facebook publishing isn't configured yet — set FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID on the API server.",
      );
    }

    const form = new FormData();
    form.append('caption', caption);
    form.append('access_token', accessToken);
    form.append('source', new Blob([Buffer.from(imageBase64, 'base64')], { type: 'image/png' }), 'post.png');

    const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/photos`, {
      method: 'POST',
      body: form,
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new ProviderError(`Facebook post failed (${response.status}): ${text.slice(0, 300)}`);
    }

    const body = (await response.json()) as { id?: string; post_id?: string };
    const externalPostId = body.post_id ?? body.id;
    if (!externalPostId) {
      throw new ProviderError('Facebook returned no post id.');
    }
    return { externalPostId };
  }
}
