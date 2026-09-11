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
// See linkedin.connector.ts's comment — LinkedIn versions expire ~2 years
// after release; bump this periodically.
const LINKEDIN_VERSION = '202608';

// Posting to an organization page needs w_organization_social (and the
// "Community Management API" product approved for the app, which requires
// LinkedIn review). Posting to the authorizing member's own profile only
// needs w_member_social, part of every app's default "Sign In with
// LinkedIn" + "Share on LinkedIn" products — no review needed. Scoped down
// to the member-only set for now; add the organization scopes back once
// Community Management API is approved (see lookupOrganizationUrn below,
// which already handles that case, it just never gets called with enough
// scope right now).
const SCOPES = ['openid', 'profile', 'w_member_social'];

const STATE_TTL_MS = 10 * 60 * 1000;

interface PendingState {
  platformId: string;
  expiresAt: number;
}

/** Real "Connect with LinkedIn" OAuth 2.0 (authorization-code) flow — the
 *  admin clicks through LinkedIn's own consent screen once; on return we
 *  exchange the code for a long-lived-ish access token, resolve who/what to
 *  post as (an organization page if the app has that scope approved,
 *  otherwise the authorizing member's own profile), and save both as this
 *  platform's "access-token" / "organization-urn" credential fields (the
 *  latter holds either kind of URN — see lookupAuthorUrn). Client ID/Secret
 *  are read from the platform's own credential fields (already entered via
 *  Add Platform) rather than app-wide env vars, so this works for any
 *  platform record named "LinkedIn", not just a hardcoded one. */
@Injectable()
export class LinkedInOAuthService {
  // In-memory CSRF state store — fine for a single-instance demo backend;
  // a multi-instance deployment would need this in Postgres/Redis instead.
  private readonly pending = new Map<string, PendingState>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
    private readonly config: ConfigService,
  ) {}

  private apiUrl(): string {
    return this.config.get<string>('API_URL') ?? 'http://localhost:4000';
  }

  private appUrl(): string {
    return this.config.get<string>('APP_URL') ?? 'http://localhost:3000';
  }

  private redirectUri(): string {
    return `${this.apiUrl()}/platforms/oauth/linkedin/callback`;
  }

  /** Reads a credential field's real value, decrypting it first if it's
   *  marked secret — every read of client-id/client-secret goes through
   *  this since the admin may have marked either as secret. */
  private fieldValue(fields: { key: string; secret: boolean; value: string }[], key: string): string | undefined {
    const field = fields.find((f) => f.key === key);
    if (!field?.value) return undefined;
    return field.secret ? this.encryption.decrypt(field.value) : field.value;
  }

  async buildAuthorizeUrl(platformId: string): Promise<string> {
    const platform = await this.prisma.platform.findUnique({
      where: { id: platformId },
      include: { credentialFields: true },
    });
    if (!platform) throw new NotFoundException('Platform not found.');

    const clientId = this.fieldValue(platform.credentialFields, 'client-id');
    if (!clientId) {
      throw new ProviderNotConfiguredException(
        'Add a Client ID (from your LinkedIn app) to this platform before connecting with LinkedIn.',
      );
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

  /** Handles LinkedIn's redirect back. Returns a URL to send the browser
   *  to (the frontend's Add Platform page, with a status query param) —
   *  the controller does the actual redirect. */
  async handleCallback(query: { code?: string; state?: string; error?: string; error_description?: string }): Promise<string> {
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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'LinkedIn connection failed.';
      return `${appBase}?linkedin=error&message=${encodeURIComponent(message)}`;
    }
  }

  private async exchangeAndStore(platformId: string, code: string): Promise<void> {
    const platform = await this.prisma.platform.findUnique({
      where: { id: platformId },
      include: { credentialFields: true },
    });
    if (!platform) throw new ProviderError('The LinkedIn platform this connection was started for no longer exists.');

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
    const tokenBody = (await tokenResponse.json()) as { access_token?: string };
    const accessToken = tokenBody.access_token;
    if (!accessToken) {
      throw new ProviderError('LinkedIn did not return an access token.');
    }

    // Everything downstream (image upload, the post's `author` field) just
    // takes this as an opaque URN — LinkedIn's Posts API accepts either an
    // organization or a person there, so no other code needed to change to
    // support posting as the member instead of a company page.
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

  /** Tries an organization URN first (only succeeds if the app has org
   *  scopes approved — harmless 403 otherwise), then falls back to the
   *  authorizing member's own profile URN via the OpenID userinfo
   *  endpoint, which w_member_social-only apps can always reach. */
  private async lookupAuthorUrn(accessToken: string): Promise<string | null> {
    const orgUrn = await this.lookupOrganizationUrn(accessToken);
    if (orgUrn) return orgUrn;
    return this.lookupPersonUrn(accessToken);
  }

  private async lookupOrganizationUrn(accessToken: string): Promise<string | null> {
    const response = await fetch(ORG_ACLS_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'LinkedIn-Version': LINKEDIN_VERSION,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { elements?: { organization?: string }[] };
    return body.elements?.[0]?.organization ?? null;
  }

  private async lookupPersonUrn(accessToken: string): Promise<string | null> {
    const response = await fetch(USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { sub?: string };
    return body.sub ? `urn:li:person:${body.sub}` : null;
  }

  private async upsertCredentialField(
    platformId: string,
    field: { key: string; label: string; secret: boolean; value: string; position: number },
  ): Promise<void> {
    await this.prisma.credentialField.upsert({
      where: { platformId_key: { platformId, key: field.key } },
      create: { platformId, ...field },
      update: { value: field.value },
    });
  }

  private sweepExpired(): void {
    const now = Date.now();
    for (const [state, entry] of this.pending) {
      if (entry.expiresAt < now) this.pending.delete(state);
    }
  }
}
