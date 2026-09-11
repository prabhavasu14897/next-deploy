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
import { randomBytes } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma.service.js';
import { EncryptionService } from '../../common/encryption.service.js';
import { ProviderError, ProviderNotConfiguredException } from '../../common/provider-exceptions.js';
const AUTHORIZE_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const ORG_ACLS_URL = 'https://api.linkedin.com/rest/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED';
const USERINFO_URL = 'https://api.linkedin.com/v2/userinfo';
const LINKEDIN_VERSION = '202608';
const SCOPES = ['openid', 'profile', 'w_member_social'];
const STATE_TTL_MS = 10 * 60 * 1000;
let LinkedInOAuthService = class LinkedInOAuthService {
    prisma;
    encryption;
    config;
    pending = new Map();
    constructor(prisma, encryption, config) {
        this.prisma = prisma;
        this.encryption = encryption;
        this.config = config;
    }
    apiUrl() {
        return this.config.get('API_URL') ?? 'http://localhost:4000';
    }
    appUrl() {
        return this.config.get('APP_URL') ?? 'http://localhost:3000';
    }
    redirectUri() {
        return `${this.apiUrl()}/platforms/oauth/linkedin/callback`;
    }
    fieldValue(fields, key) {
        const field = fields.find((f) => f.key === key);
        if (!field?.value)
            return undefined;
        return field.secret ? this.encryption.decrypt(field.value) : field.value;
    }
    async buildAuthorizeUrl(platformId) {
        const platform = await this.prisma.platform.findUnique({
            where: { id: platformId },
            include: { credentialFields: true },
        });
        if (!platform)
            throw new NotFoundException('Platform not found.');
        const clientId = this.fieldValue(platform.credentialFields, 'client-id');
        if (!clientId) {
            throw new ProviderNotConfiguredException('Add a Client ID (from your LinkedIn app) to this platform before connecting with LinkedIn.');
        }
        this.sweepExpired();
        const state = randomBytes(24).toString('hex');
        this.pending.set(state, { platformId, expiresAt: Date.now() + STATE_TTL_MS });
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            redirect_uri: this.redirectUri(),
            state,
            scope: SCOPES.join(' '),
        });
        return `${AUTHORIZE_URL}?${params.toString()}`;
    }
    async handleCallback(query) {
        const appBase = `${this.appUrl()}/add-platform`;
        if (query.error) {
            return `${appBase}?linkedin=error&message=${encodeURIComponent(query.error_description ?? query.error)}`;
        }
        const state = query.state;
        const code = query.code;
        if (!state || !code) {
            return `${appBase}?linkedin=error&message=${encodeURIComponent('LinkedIn did not return an authorization code.')}`;
        }
        this.sweepExpired();
        const pending = this.pending.get(state);
        this.pending.delete(state);
        if (!pending) {
            return `${appBase}?linkedin=error&message=${encodeURIComponent('This LinkedIn connection attempt expired — try again.')}`;
        }
        try {
            await this.exchangeAndStore(pending.platformId, code);
            return `${appBase}?linkedin=connected`;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'LinkedIn connection failed.';
            return `${appBase}?linkedin=error&message=${encodeURIComponent(message)}`;
        }
    }
    async exchangeAndStore(platformId, code) {
        const platform = await this.prisma.platform.findUnique({
            where: { id: platformId },
            include: { credentialFields: true },
        });
        if (!platform)
            throw new ProviderError('The LinkedIn platform this connection was started for no longer exists.');
        const clientId = this.fieldValue(platform.credentialFields, 'client-id');
        const clientSecret = this.fieldValue(platform.credentialFields, 'client-secret');
        if (!clientId || !clientSecret) {
            throw new ProviderNotConfiguredException('Client ID and Client Secret must both be set on the LinkedIn platform.');
        }
        const tokenResponse = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: this.redirectUri(),
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });
        if (!tokenResponse.ok) {
            const text = await tokenResponse.text().catch(() => '');
            throw new ProviderError(`LinkedIn token exchange failed (${tokenResponse.status}): ${text.slice(0, 300)}`);
        }
        const tokenBody = (await tokenResponse.json());
        const accessToken = tokenBody.access_token;
        if (!accessToken) {
            throw new ProviderError('LinkedIn did not return an access token.');
        }
        const authorUrn = await this.lookupAuthorUrn(accessToken);
        await this.upsertCredentialField(platformId, {
            key: 'access-token',
            label: 'Access Token',
            secret: true,
            value: this.encryption.encrypt(accessToken),
            position: 100,
        });
        if (authorUrn) {
            await this.upsertCredentialField(platformId, {
                key: 'organization-urn',
                label: 'Organization URN',
                secret: false,
                value: authorUrn,
                position: 101,
            });
        }
    }
    async lookupAuthorUrn(accessToken) {
        const orgUrn = await this.lookupOrganizationUrn(accessToken);
        if (orgUrn)
            return orgUrn;
        return this.lookupPersonUrn(accessToken);
    }
    async lookupOrganizationUrn(accessToken) {
        const response = await fetch(ORG_ACLS_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'LinkedIn-Version': LINKEDIN_VERSION,
                'X-Restli-Protocol-Version': '2.0.0',
            },
        });
        if (!response.ok)
            return null;
        const body = (await response.json());
        return body.elements?.[0]?.organization ?? null;
    }
    async lookupPersonUrn(accessToken) {
        const response = await fetch(USERINFO_URL, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok)
            return null;
        const body = (await response.json());
        return body.sub ? `urn:li:person:${body.sub}` : null;
    }
    async upsertCredentialField(platformId, field) {
        await this.prisma.credentialField.upsert({
            where: { platformId_key: { platformId, key: field.key } },
            create: { platformId, ...field },
            update: { value: field.value },
        });
    }
    sweepExpired() {
        const now = Date.now();
        for (const [state, entry] of this.pending) {
            if (entry.expiresAt < now)
                this.pending.delete(state);
        }
    }
};
LinkedInOAuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        EncryptionService,
        ConfigService])
], LinkedInOAuthService);
export { LinkedInOAuthService };
//# sourceMappingURL=linkedin-oauth.service.js.map