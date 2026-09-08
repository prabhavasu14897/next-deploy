var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { ProviderError, ProviderNotConfiguredException } from '../../common/provider-exceptions.js';
let GenericConnector = class GenericConnector {
    key = '__generic__';
    async connect({ apiBaseUrl, credentials, secretKeys }) {
        if (!apiBaseUrl) {
            throw new ProviderNotConfiguredException('This platform has no API Base URL set in Add Platform yet.');
        }
        const token = secretKeys.map((key) => credentials[key]).find(Boolean);
        if (!token) {
            throw new ProviderNotConfiguredException('This platform has no credential value set yet — fill in its fields in Add Platform.');
        }
        const response = await fetch(apiBaseUrl, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new ProviderError(`Connection check failed (${response.status}): ${text.slice(0, 300)}`);
        }
        return { accounts: [] };
    }
};
GenericConnector = __decorate([
    Injectable()
], GenericConnector);
export { GenericConnector };
//# sourceMappingURL=generic.connector.js.map