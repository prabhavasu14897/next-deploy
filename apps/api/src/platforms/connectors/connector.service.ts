import { Inject, Injectable } from '@nestjs/common';
import { PLATFORM_CONNECTORS } from './connector.interface.js';
import type { DecryptedPlatform, DiscoveredAccount, PlatformConnector } from './connector.interface.js';
import { GenericConnector } from './generic.connector.js';

@Injectable()
export class ConnectorService {
  private readonly connectors: Map<string, PlatformConnector>;

  constructor(
    @Inject(PLATFORM_CONNECTORS) connectors: PlatformConnector[],
    private readonly generic: GenericConnector,
  ) {
    this.connectors = new Map(connectors.map((connector) => [connector.key, connector]));
  }

  connect(platformKey: string, platform: DecryptedPlatform): Promise<{ accounts: DiscoveredAccount[] }> {
    const connector = this.connectors.get(platformKey.toLowerCase()) ?? this.generic;
    return connector.connect(platform);
  }
}
