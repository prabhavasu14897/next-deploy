import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderError, ProviderNotConfiguredException } from '../../common/provider-exceptions.js';
import type { PublishInput, PublishProvider, PublishResult } from '../publish-provider.interface.js';

// LinkedIn revs this quarterly (YYYYMM) — bump to whatever's current when
// real tokens are tested against it.
const LINKEDIN_VERSION = '202401';

@Injectable()
export class LinkedInProvider implements PublishProvider {
  readonly key = 'linkedin';

  constructor(private readonly config: ConfigService) {}

  async publish({ imageBase64, caption }: PublishInput): Promise<PublishResult> {
    const accessToken = this.config.get<string>('LINKEDIN_ACCESS_TOKEN');
    const orgUrn = this.config.get<string>('LINKEDIN_ORG_URN');
    if (!accessToken || !orgUrn) {
      throw new ProviderNotConfiguredException(
        "LinkedIn publishing isn't configured yet — set LINKEDIN_ACCESS_TOKEN and LINKEDIN_ORG_URN on the API server.",
      );
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'LinkedIn-Version': LINKEDIN_VERSION,
      'X-Restli-Protocol-Version': '2.0.0',
      'Content-Type': 'application/json',
    };

    const initRes = await fetch('https://api.linkedin.com/rest/images?action=initializeUpload', {
      method: 'POST',
      headers,
      body: JSON.stringify({ initializeUploadRequest: { owner: orgUrn } }),
    });
    if (!initRes.ok) {
      throw new ProviderError(await describeError('LinkedIn image upload init', initRes));
    }
    const initBody = (await initRes.json()) as { value: { uploadUrl: string; image: string } };

    const uploadRes = await fetch(initBody.value.uploadUrl, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: Buffer.from(imageBase64, 'base64'),
    });
    if (!uploadRes.ok) {
      throw new ProviderError(await describeError('LinkedIn image upload', uploadRes));
    }

    const postRes = await fetch('https://api.linkedin.com/rest/posts', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        author: orgUrn,
        commentary: caption,
        visibility: 'PUBLIC',
        lifecycleState: 'PUBLISHED',
        distribution: {
          feedDistribution: 'MAIN_FEED',
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
        content: { media: { id: initBody.value.image } },
      }),
    });
    if (!postRes.ok) {
      throw new ProviderError(await describeError('LinkedIn post', postRes));
    }

    const externalPostId = postRes.headers.get('x-restli-id') ?? initBody.value.image;
    return { externalPostId };
  }
}

async function describeError(label: string, response: Response): Promise<string> {
  const text = await response.text().catch(() => '');
  return `${label} failed (${response.status}): ${text.slice(0, 300)}`;
}
