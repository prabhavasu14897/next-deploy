import { Module } from '@nestjs/common';
import { PlatformsController } from './platforms.controller.js';
import { PlatformsService } from './platforms.service.js';
import { PrismaService } from '../common/prisma.service.js';
import { EncryptionService } from '../common/encryption.service.js';
import { PLATFORM_CONNECTORS } from './connectors/connector.interface.js';
import { LinkedInConnector } from './connectors/linkedin.connector.js';
import { FacebookConnector } from './connectors/facebook.connector.js';
import { GenericConnector } from './connectors/generic.connector.js';
import { ConnectorService } from './connectors/connector.service.js';

@Module({
  controllers: [PlatformsController],
  providers: [
    PrismaService,
    EncryptionService,
    LinkedInConnector,
    FacebookConnector,
    GenericConnector,
    {
      provide: PLATFORM_CONNECTORS,
      useFactory: (linkedin: LinkedInConnector, facebook: FacebookConnector) => [linkedin, facebook],
      inject: [LinkedInConnector, FacebookConnector],
    },
    ConnectorService,
    PlatformsService,
  ],
  exports: [PlatformsService, PrismaService, EncryptionService],
})
export class PlatformsModule {}
