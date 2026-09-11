var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
import { LinkedInOAuthController } from './oauth/linkedin-oauth.controller.js';
import { LinkedInOAuthService } from './oauth/linkedin-oauth.service.js';
let PlatformsModule = class PlatformsModule {
};
PlatformsModule = __decorate([
    Module({
        controllers: [PlatformsController, LinkedInOAuthController],
        providers: [
            PrismaService,
            EncryptionService,
            LinkedInConnector,
            FacebookConnector,
            GenericConnector,
            {
                provide: PLATFORM_CONNECTORS,
                useFactory: (linkedin, facebook) => [linkedin, facebook],
                inject: [LinkedInConnector, FacebookConnector],
            },
            ConnectorService,
            PlatformsService,
            LinkedInOAuthService,
        ],
        exports: [PlatformsService, PrismaService, EncryptionService],
    })
], PlatformsModule);
export { PlatformsModule };
//# sourceMappingURL=platforms.module.js.map