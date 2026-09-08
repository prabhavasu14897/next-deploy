import { Injectable } from '@nestjs/common';
import { ProviderError, ProviderNotConfiguredException } from '../../common/provider-exceptions.js';
import type { DecryptedPlatform, DiscoveredAccount, PlatformConnector } from './connector.interface.js';

// Facebook Graph API version — bump when real tokens are tested against it.
const GRAPH_VERSION = 'v21.0';

/** Facebook's credential model here is a single configured Page (a Page
 *  Access Token is inherently scoped to one page) — connecting validates
 *  that page ID + token and returns exactly one real account for it. */
@Injectable()
export class FacebookConnector implements PlatformConnector {
  readonly key = 'facebook';

  async connect({ credentials }: DecryptedPlatform): Promise<{ accounts: DiscoveredAccount[] }> {
    const accessToken = credentials['page-access-token'];
    const pageId = credentials['page-id'];
    if (!accessToken || !pageId) {
      throw new ProviderNotConfiguredException(
        "Facebook isn't configured yet — add a Page Access Token and Page ID to the Facebook platform in Add Platform.",
      );
    }

    const url = `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}?fields=name,fan_count,username&access_token=${encodeURIComponent(accessToken)}`;
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new ProviderError(`Facebook page lookup failed (${response.status}): ${text.slice(0, 300)}`);
    }

    const body = (await response.json()) as { name?: string; username?: string; fan_count?: number };
    return {
      accounts: [
        {
          externalId: pageId,
          name: body.name ?? `Facebook page ${pageId}`,
          handle: body.username ? `@${body.username}` : `@${pageId}`,
          type: 'Page',
          followers: body.fan_count ?? 0,
        },
      ],
    };
  }
}
