var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable } from '@nestjs/common';
import { PUBLISH_PROVIDERS } from './publish-provider.interface.js';
import { PublishProviderNotSupportedException } from './publish.exceptions.js';
import { PrismaService } from '../common/prisma.service.js';
import { EncryptionService } from '../common/encryption.service.js';
import { ProviderNotConfiguredException } from '../common/provider-exceptions.js';
let PublishService = class PublishService {
    prisma;
    encryption;
    providers;
    constructor(providers, prisma, encryption) {
        this.prisma = prisma;
        this.encryption = encryption;
        this.providers = new Map(providers.map((provider) => [provider.key, provider]));
    }
    async publish(platformKey, input) {
        const provider = this.providers.get(platformKey.toLowerCase());
        if (!provider) {
            throw new PublishProviderNotSupportedException(platformKey);
        }
        const credentials = await this.resolveCredentials(platformKey);
        return provider.publish({ ...input, credentials });
    }
    async resolveCredentials(platformKey) {
        const platforms = await this.prisma.platform.findMany({ include: { credentialFields: true } });
        const platform = platforms.find((p) => p.name.toLowerCase() === platformKey.toLowerCase());
        if (!platform) {
            throw new ProviderNotConfiguredException(`No "${platformKey}" platform is set up in Add Platform yet.`);
        }
        const credentials = {};
        for (const field of platform.credentialFields) {
            credentials[field.key] = field.secret && field.value ? this.encryption.decrypt(field.value) : field.value;
        }
        return credentials;
    }
};
PublishService = __decorate([
    Injectable(),
    __param(0, Inject(PUBLISH_PROVIDERS)),
    __metadata("design:paramtypes", [Array, PrismaService,
        EncryptionService])
], PublishService);
export { PublishService };
//# sourceMappingURL=publish.service.js.map