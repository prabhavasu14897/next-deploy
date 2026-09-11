var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { ProviderError, ProviderNotConfiguredException } from '../../common/provider-exceptions.js';
const LINKEDIN_VERSION = '202608';
let LinkedInConnector = class LinkedInConnector {
    key = 'linkedin';
    async connect({ credentials }) {
        const accessToken = credentials['access-token'];
        const authorUrn = credentials['organization-urn'];
        if (!accessToken || !authorUrn) {
            throw new ProviderNotConfiguredException("LinkedIn isn't configured yet — add an Access Token and Organization URN to the LinkedIn platform in Add Platform.");
        }
        if (authorUrn.startsWith('urn:li:person:')) {
            return this.connectAsPerson(accessToken, authorUrn);
        }
        return this.connectAsOrganization(accessToken, authorUrn);
    }
    async connectAsOrganization(accessToken, orgUrn) {
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
        const body = (await response.json());
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
    async connectAsPerson(accessToken, personUrn) {
        const response = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new ProviderError(`LinkedIn profile lookup failed (${response.status}): ${text.slice(0, 300)}`);
        }
        const body = (await response.json());
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
};
LinkedInConnector = __decorate([
    Injectable()
], LinkedInConnector);
export { LinkedInConnector };
//# sourceMappingURL=linkedin.connector.js.map