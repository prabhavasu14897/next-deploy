var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service.js';
import { EncryptionService } from '../common/encryption.service.js';
import { ConnectorService } from './connectors/connector.service.js';
let PlatformsService = class PlatformsService {
    prisma;
    encryption;
    connectors;
    constructor(prisma, encryption, connectors) {
        this.prisma = prisma;
        this.encryption = encryption;
        this.connectors = connectors;
    }
    async list() {
        const platforms = await this.prisma.platform.findMany({
            include: { credentialFields: { orderBy: { position: 'asc' } } },
            orderBy: { createdAt: 'asc' },
        });
        return platforms.map((p) => this.toResponse(p));
    }
    async create(dto) {
        const platform = await this.prisma.platform.create({
            data: {
                name: dto.name,
                summary: dto.summary,
                accountNoun: dto.accountNoun,
                accountNounPlural: dto.accountNounPlural,
                apiBaseUrl: dto.apiBaseUrl,
                credentialFields: {
                    create: dto.credentialFields.map((f, i) => ({
                        key: f.key,
                        label: f.label,
                        secret: f.secret,
                        value: f.secret && f.value ? this.encryption.encrypt(f.value) : f.value,
                        position: i,
                    })),
                },
            },
            include: { credentialFields: { orderBy: { position: 'asc' } } },
        });
        return this.toResponse(platform);
    }
    async update(id, dto) {
        const existing = await this.prisma.platform.findUnique({
            where: { id },
            include: { credentialFields: true },
        });
        if (!existing)
            throw new NotFoundException('Platform not found.');
        const existingByKey = new Map(existing.credentialFields.map((f) => [f.key, f]));
        const incomingKeys = new Set(dto.credentialFields.map((f) => f.key));
        await this.prisma.$transaction([
            this.prisma.platform.update({
                where: { id },
                data: {
                    name: dto.name,
                    summary: dto.summary,
                    accountNoun: dto.accountNoun,
                    accountNounPlural: dto.accountNounPlural,
                    apiBaseUrl: dto.apiBaseUrl,
                },
            }),
            this.prisma.credentialField.deleteMany({
                where: { platformId: id, key: { notIn: [...incomingKeys] } },
            }),
            ...dto.credentialFields.map((f, i) => {
                const prior = existingByKey.get(f.key);
                const storedValue = f.secret && !f.value ? (prior?.value ?? '') : f.secret ? this.encryption.encrypt(f.value) : f.value;
                return this.prisma.credentialField.upsert({
                    where: { platformId_key: { platformId: id, key: f.key } },
                    create: { platformId: id, key: f.key, label: f.label, secret: f.secret, value: storedValue, position: i },
                    update: { label: f.label, secret: f.secret, value: storedValue, position: i },
                });
            }),
        ]);
        const updated = await this.prisma.platform.findUniqueOrThrow({
            where: { id },
            include: { credentialFields: { orderBy: { position: 'asc' } } },
        });
        return this.toResponse(updated);
    }
    async remove(id) {
        await this.prisma.platform.delete({ where: { id } }).catch(() => {
            throw new NotFoundException('Platform not found.');
        });
    }
    async connect(id) {
        const platform = await this.prisma.platform.findUnique({
            where: { id },
            include: { credentialFields: true },
        });
        if (!platform)
            throw new NotFoundException('Platform not found.');
        const credentials = {};
        const secretKeys = [];
        for (const field of platform.credentialFields) {
            credentials[field.key] = field.secret && field.value ? this.encryption.decrypt(field.value) : field.value;
            if (field.secret)
                secretKeys.push(field.key);
        }
        return this.connectors.connect(platform.name.toLowerCase(), {
            id: platform.id,
            name: platform.name,
            apiBaseUrl: platform.apiBaseUrl,
            credentials,
            secretKeys,
        });
    }
    toResponse(platform) {
        return {
            id: platform.id,
            name: platform.name,
            summary: platform.summary,
            accountNoun: platform.accountNoun,
            accountNounPlural: platform.accountNounPlural,
            apiBaseUrl: platform.apiBaseUrl,
            createdAt: platform.createdAt.toISOString(),
            updatedAt: platform.updatedAt.toISOString(),
            credentialFields: platform.credentialFields.map((f) => ({
                key: f.key,
                label: f.label,
                secret: f.secret,
                value: f.secret ? null : f.value,
                hasValue: f.value.length > 0,
            })),
        };
    }
};
PlatformsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        EncryptionService,
        ConnectorService])
], PlatformsService);
export { PlatformsService };
//# sourceMappingURL=platforms.service.js.map