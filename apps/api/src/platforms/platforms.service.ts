import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service.js';
import { EncryptionService } from '../common/encryption.service.js';
import { ConnectorService } from './connectors/connector.service.js';
import type { DiscoveredAccount } from './connectors/connector.interface.js';

export interface CredentialFieldDto {
  key: string;
  label: string;
  secret: boolean;
  /** Empty string means "leave unchanged" when editing a secret field. */
  value: string;
}

export interface PlatformDto {
  name: string;
  summary: string;
  accountNoun: string;
  accountNounPlural: string;
  apiBaseUrl: string;
  credentialFields: CredentialFieldDto[];
}

export interface CredentialFieldResponse {
  key: string;
  label: string;
  secret: boolean;
  /** Never a decrypted secret — null when secret, the real value otherwise. */
  value: string | null;
  hasValue: boolean;
}

export interface PlatformResponse {
  id: string;
  name: string;
  summary: string;
  accountNoun: string;
  accountNounPlural: string;
  apiBaseUrl: string;
  credentialFields: CredentialFieldResponse[];
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class PlatformsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
    private readonly connectors: ConnectorService,
  ) {}

  async list(): Promise<PlatformResponse[]> {
    const platforms = await this.prisma.platform.findMany({
      include: { credentialFields: { orderBy: { position: 'asc' } } },
      orderBy: { createdAt: 'asc' },
    });
    return platforms.map((p) => this.toResponse(p));
  }

  async create(dto: PlatformDto): Promise<PlatformResponse> {
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

  async update(id: string, dto: PlatformDto): Promise<PlatformResponse> {
    const existing = await this.prisma.platform.findUnique({
      where: { id },
      include: { credentialFields: true },
    });
    if (!existing) throw new NotFoundException('Platform not found.');

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
      // Drop fields the admin removed from the form.
      this.prisma.credentialField.deleteMany({
        where: { platformId: id, key: { notIn: [...incomingKeys] } },
      }),
      ...dto.credentialFields.map((f, i) => {
        const prior = existingByKey.get(f.key);
        // Blank value on a secret field the admin didn't touch — keep what's stored.
        const storedValue =
          f.secret && !f.value ? (prior?.value ?? '') : f.secret ? this.encryption.encrypt(f.value) : f.value;
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

  async remove(id: string): Promise<void> {
    await this.prisma.platform.delete({ where: { id } }).catch(() => {
      throw new NotFoundException('Platform not found.');
    });
  }

  async connect(id: string): Promise<{ accounts: DiscoveredAccount[] }> {
    const platform = await this.prisma.platform.findUnique({
      where: { id },
      include: { credentialFields: true },
    });
    if (!platform) throw new NotFoundException('Platform not found.');

    const credentials: Record<string, string> = {};
    const secretKeys: string[] = [];
    for (const field of platform.credentialFields) {
      credentials[field.key] = field.secret && field.value ? this.encryption.decrypt(field.value) : field.value;
      if (field.secret) secretKeys.push(field.key);
    }

    return this.connectors.connect(platform.name.toLowerCase(), {
      id: platform.id,
      name: platform.name,
      apiBaseUrl: platform.apiBaseUrl,
      credentials,
      secretKeys,
    });
  }

  private toResponse(platform: {
    id: string;
    name: string;
    summary: string;
    accountNoun: string;
    accountNounPlural: string;
    apiBaseUrl: string;
    createdAt: Date;
    updatedAt: Date;
    credentialFields: { key: string; label: string; secret: boolean; value: string }[];
  }): PlatformResponse {
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
}
