var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable } from '@nestjs/common';
import { PUBLISH_PROVIDERS } from './publish-provider.interface.js';
import { PublishProviderNotSupportedException } from './publish.exceptions.js';
let PublishService = class PublishService {
    providers;
    constructor(providers) {
        this.providers = new Map(providers.map((provider) => [provider.key, provider]));
    }
    publish(platformKey, input) {
        const provider = this.providers.get(platformKey.toLowerCase());
        if (!provider) {
            throw new PublishProviderNotSupportedException(platformKey);
        }
        return provider.publish(input);
    }
};
PublishService = __decorate([
    Injectable(),
    __param(0, Inject(PUBLISH_PROVIDERS)),
    __metadata("design:paramtypes", [Array])
], PublishService);
export { PublishService };
//# sourceMappingURL=publish.service.js.map