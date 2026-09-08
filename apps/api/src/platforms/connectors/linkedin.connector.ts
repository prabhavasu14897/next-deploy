import { Injectable } from '@nestjs/common';
import { ProviderError, ProviderNotConfiguredException } from '../../common/provider-exceptions.js';
import type { DecryptedPlatform, DiscoveredAccount, PlatformConnector } from './connector.interface.js';

// LinkedIn revs this quarterly (YYYYMM) — bump to whatever's current when
// real tokens are tested against it.
const LINKEDIN_VERSION = '202401';

/** LinkedIn's credential model here is a single configured organization,
 *  not a full OAuth multi-page listing — connecting validates that org URN
 *  + token and returns exactly one real account for it. */
@Injectable()
export class LinkedInConnector implements PlatformConnector {
  readonly key = 'linkedin';

  async connect({ credentials }: DecryptedPlatform): Promise<{ accounts: DiscoveredAccount[] }> {
    const accessToken = credentials['access-token'];
    const orgUrn = credentials['organization-urn'];
    if (!accessToken || !orgUrn) {
      throw new ProviderNotConfiguredException(
        "LinkedIn isn't configured yet — add an Access Token and Organization URN to the LinkedIn platform in Add Platform.",
      );
    }

    const orgId = orgUrn.split(':').pop();
    const response = await fetch(`https://api.linkedin.com/rest/organizations/${orgId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'LinkedIn-Version': LINKEDIN_VERSION,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new ProviderError(`LinkedIn organization lookup failed (${response.status}): ${text.slice(0, 300)}`);
    }

    const body = (await response.json()) as { localizedName?: string; vanityName?: string };
    const name = body.localizedName ?? `LinkedIn organization ${orgId}`;
    return {
      accounts: [
        {
          externalId: orgUrn,
          name,
          handle: body.vanityName ? `@${body.vanityName}` : `@${orgId}`,
          type: 'Page',
          followers: 0,
        },
      ],
    };
  }
}
