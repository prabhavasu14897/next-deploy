var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { ProviderError, ProviderNotConfiguredException } from '../../common/provider-exceptions.js';
const GRAPH_VERSION = 'v21.0';
let FacebookConnector = class FacebookConnector {
    key = 'facebook';
    async connect({ credentials }) {
        const accessToken = credentials['page-access-token'];
        const pageId = credentials['page-id'];
        if (!accessToken || !pageId) {
            throw new ProviderNotConfiguredException("Facebook isn't configured yet — add a Page Access Token and Page ID to the Facebook platform in Add Platform.");
        }
        const url = `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}?fields=name,fan_count,username&access_token=${encodeURIComponent(accessToken)}`;
        const response = await fetch(url);
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new ProviderError(`Facebook page lookup failed (${response.status}): ${text.slice(0, 300)}`);
        }
        const body = (await response.json());
        return {
            accounts: [
                {
                    externalId: pageId,
                    name: body.name ?? `Facebook page ${pageId}`,
                    handle: body.username ? `@${body.username}` : `@${pageId}`,
                    type: 'Page',
                    followers: body.fan_count ?? 0,
                },
            ],
        };
    }
};
FacebookConnector = __decorate([
    Injectable()
], FacebookConnector);
export { FacebookConnector };
//# sourceMappingURL=facebook.connector.js.map