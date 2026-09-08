import { Injectable } from '@nestjs/common';
import { ProviderError, ProviderNotConfiguredException } from '../../common/provider-exceptions.js';
import type { DecryptedPlatform, DiscoveredAccount, PlatformConnector } from './connector.interface.js';

/** Fallback for any platform without a bespoke connector — a truly
 *  generic client can't know an arbitrary API's response shape, so this
 *  only validates the credential (one authenticated GET to apiBaseUrl,
 *  2xx = connected) rather than attempting real account discovery. The
 *  org adds pages manually afterward via the existing manual-entry flow. */
@Injectable()
export class GenericConnector implements PlatformConnector {
  readonly key = '__generic__';

  async connect({ apiBaseUrl, credentials, secretKeys }: DecryptedPlatform): Promise<{ accounts: DiscoveredAccount[] }> {
    if (!apiBaseUrl) {
      throw new ProviderNotConfiguredException('This platform has no API Base URL set in Add Platform yet.');
    }
    const token = secretKeys.map((key) => credentials[key]).find(Boolean);
    if (!token) {
      throw new ProviderNotConfiguredException(
        'This platform has no credential value set yet — fill in its fields in Add Platform.',
      );
    }

    const response = await fetch(apiBaseUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new ProviderError(`Connection check failed (${response.status}): ${text.slice(0, 300)}`);
    }

    // A generic client can't reliably parse an unknown API's response into
    // accounts/pages — the credential validated, that's all this can promise.
    return { accounts: [] };
  }
}
