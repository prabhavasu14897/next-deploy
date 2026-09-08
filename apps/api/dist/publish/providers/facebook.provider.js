var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { ProviderError, ProviderNotConfiguredException } from '../../common/provider-exceptions.js';
const GRAPH_VERSION = 'v21.0';
let FacebookProvider = class FacebookProvider {
    key = 'facebook';
    async publish({ imageBase64, caption, credentials }) {
        const accessToken = credentials['page-access-token'];
        const pageId = credentials['page-id'];
        if (!accessToken || !pageId) {
            throw new ProviderNotConfiguredException("Facebook publishing isn't configured yet — add a Page Access Token and Page ID to the Facebook platform in Add Platform.");
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
    Injectable()
], FacebookProvider);
export { FacebookProvider };
//# sourceMappingURL=facebook.provider.js.map