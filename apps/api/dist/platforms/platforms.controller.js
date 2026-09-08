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
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { PlatformsService } from './platforms.service.js';
class CredentialFieldBody {
    key;
    label;
    secret;
    value;
}
class PlatformBody {
    name;
    summary;
    accountNoun;
    accountNounPlural;
    apiBaseUrl;
    credentialFields;
}
let PlatformsController = class PlatformsController {
    platformsService;
    constructor(platformsService) {
        this.platformsService = platformsService;
    }
    list() {
        return this.platformsService.list();
    }
    create(body) {
        return this.platformsService.create(body);
    }
    update(id, body) {
        return this.platformsService.update(id, body);
    }
    remove(id) {
        return this.platformsService.remove(id);
    }
    connect(id) {
        return this.platformsService.connect(id);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformsController.prototype, "list", null);
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlatformBody]),
    __metadata("design:returntype", void 0)
], PlatformsController.prototype, "create", null);
__decorate([
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PlatformBody]),
    __metadata("design:returntype", void 0)
], PlatformsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    HttpCode(204),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformsController.prototype, "remove", null);
__decorate([
    Post(':id/connect'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformsController.prototype, "connect", null);
PlatformsController = __decorate([
    Controller('platforms'),
    __metadata("design:paramtypes", [PlatformsService])
], PlatformsController);
export { PlatformsController };
//# sourceMappingURL=platforms.controller.js.map