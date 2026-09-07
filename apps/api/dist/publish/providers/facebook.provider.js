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
const GRAPH_VERSION = 'v21.0';
let FacebookProvider = class FacebookProvider {
    config;
    key = 'facebook';
    constructor(config) {
        this.config = config;
    }
    async publish({ imageBase64, caption }) {
        const accessToken = this.config.get('FACEBOOK_PAGE_ACCESS_TOKEN');
        const pageId = this.config.get('FACEBOOK_PAGE_ID');
        if (!accessToken || !pageId) {
            throw new ProviderNotConfiguredException("Facebook publishing isn't configured yet — set FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID on the API server.");
        }
        const form = new FormData();
        form.append('caption', caption);
        form.append('access_token', accessToken);
        form.append('source', new Blob([Buffer.from(imageBase64, 'base64')], { type: 'image/png' }), 'post.png');
        const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/photos`, {
            method: 'POST',
            body: form,
        });
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new ProviderError(`Facebook post failed (${response.status}): ${text.slice(0, 300)}`);
        }
        const body = (await response.json());
        const externalPostId = body.post_id ?? body.id;
        if (!externalPostId) {
            throw new ProviderError('Facebook returned no post id.');
        }
        return { externalPostId };
    }
};
FacebookProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], FacebookProvider);
export { FacebookProvider };
//# sourceMappingURL=facebook.provider.js.map