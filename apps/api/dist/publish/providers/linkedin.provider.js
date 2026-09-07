var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderError, ProviderNotConfiguredException } from '../../common/provider-exceptions.js';
const LINKEDIN_VERSION = '202401';
let LinkedInProvider = class LinkedInProvider {
    config;
    key = 'linkedin';
    constructor(config) {
        this.config = config;
    }
    async publish({ imageBase64, caption }) {
        const accessToken = this.config.get('LINKEDIN_ACCESS_TOKEN');
        const orgUrn = this.config.get('LINKEDIN_ORG_URN');
        if (!accessToken || !orgUrn) {
            throw new ProviderNotConfiguredException("LinkedIn publishing isn't configured yet — set LINKEDIN_ACCESS_TOKEN and LINKEDIN_ORG_URN on the API server.");
        }
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'LinkedIn-Version': LINKEDIN_VERSION,
            'X-Restli-Protocol-Version': '2.0.0',
            'Content-Type': 'application/json',
        };
        const initRes = await fetch('https://api.linkedin.com/rest/images?action=initializeUpload', {
            method: 'POST',
            headers,
            body: JSON.stringify({ initializeUploadRequest: { owner: orgUrn } }),
        });
        if (!initRes.ok) {
            throw new ProviderError(await describeError('LinkedIn image upload init', initRes));
        }
        const initBody = (await initRes.json());
        const uploadRes = await fetch(initBody.value.uploadUrl, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${accessToken}` },
            body: Buffer.from(imageBase64, 'base64'),
        });
        if (!uploadRes.ok) {
            throw new ProviderError(await describeError('LinkedIn image upload', uploadRes));
        }
        const postRes = await fetch('https://api.linkedin.com/rest/posts', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                author: orgUrn,
                commentary: caption,
                visibility: 'PUBLIC',
                lifecycleState: 'PUBLISHED',
                distribution: {
                    feedDistribution: 'MAIN_FEED',
                    targetEntities: [],
                    thirdPartyDistributionChannels: [],
                },
                content: { media: { id: initBody.value.image } },
            }),
        });
        if (!postRes.ok) {
            throw new ProviderError(await describeError('LinkedIn post', postRes));
        }
        const externalPostId = postRes.headers.get('x-restli-id') ?? initBody.value.image;
        return { externalPostId };
    }
};
LinkedInProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], LinkedInProvider);
export { LinkedInProvider };
async function describeError(label, response) {
    const text = await response.text().catch(() => '');
    return `${label} failed (${response.status}): ${text.slice(0, 300)}`;
}
//# sourceMappingURL=linkedin.provider.js.map