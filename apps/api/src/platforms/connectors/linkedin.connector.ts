import { Injectable } from '@nestjs/common';
import { ProviderError, ProviderNotConfiguredException } from '../../common/provider-exceptions.js';
import type { DecryptedPlatform, DiscoveredAccount, PlatformConnector } from './connector.interface.js';

// LinkedIn supports each version for a minimum of 2 years from release —
// bump this periodically; 202401 was confirmed expired (426
// NONEXISTENT_VERSION) when real tokens were first tested against it.
const LINKEDIN_VERSION = '202608';

/** LinkedIn's credential model here is a single configured author — an
 *  organization page, or (until the app has Community Management API
 *  approved) the connected member's own profile — not a full OAuth
 *  multi-page listing. Connecting validates that URN + token and returns
 *  exactly one real account for it. */
@Injectable()
export class LinkedInConnector implements PlatformConnector {
  readonly key = 'linkedin';

  async connect({ credentials }: DecryptedPlatform): Promise<{ accounts: DiscoveredAccount[] }> {
    const accessToken = credentials['access-token'];
    const authorUrn = credentials['organization-urn'];
    if (!accessToken || !authorUrn) {
      throw new ProviderNotConfiguredException(
        "LinkedIn isn't configured yet — add an Access Token and Organization URN to the LinkedIn platform in Add Platform.",
      );
    }

    if (authorUrn.startsWith('urn:li:person:')) {
      return this.connectAsPerson(accessToken, authorUrn);
    }
    return this.connectAsOrganization(accessToken, authorUrn);
  }

  private async connectAsOrganization(accessToken: string, orgUrn: string): Promise<{ accounts: DiscoveredAccount[] }> {
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

  private async connectAsPerson(accessToken: string, personUrn: string): Promise<{ accounts: DiscoveredAccount[] }> {
    const response = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new ProviderError(`LinkedIn profile lookup failed (${response.status}): ${text.slice(0, 300)}`);
    }

    const body = (await response.json()) as { name?: string; given_name?: string };
    return {
      accounts: [
        {
          externalId: personUrn,
          name: body.name ?? 'LinkedIn member',
          handle: `@${body.given_name ?? 'member'}`,
          type: 'Profile',
          followers: 0,
        },
      ],
    };
  }
}
