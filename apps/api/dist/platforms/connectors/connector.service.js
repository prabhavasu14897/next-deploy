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
import { PLATFORM_CONNECTORS } from './connector.interface.js';
import { GenericConnector } from './generic.connector.js';
let ConnectorService = class ConnectorService {
    generic;
    connectors;
    constructor(connectors, generic) {
        this.generic = generic;
        this.connectors = new Map(connectors.map((connector) => [connector.key, connector]));
    }
    connect(platformKey, platform) {
        const connector = this.connectors.get(platformKey.toLowerCase()) ?? this.generic;
        return connector.connect(platform);
    }
};
ConnectorService = __decorate([
    Injectable(),
    __param(0, Inject(PLATFORM_CONNECTORS)),
    __metadata("design:paramtypes", [Array, GenericConnector])
], ConnectorService);
export { ConnectorService };
//# sourceMappingURL=connector.service.js.map