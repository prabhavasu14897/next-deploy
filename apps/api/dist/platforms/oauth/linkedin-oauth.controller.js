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
import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { LinkedInOAuthService } from './linkedin-oauth.service.js';
let LinkedInOAuthController = class LinkedInOAuthController {
    oauth;
    constructor(oauth) {
        this.oauth = oauth;
    }
    async start(id, res) {
        const url = await this.oauth.buildAuthorizeUrl(id);
        res.redirect(url);
    }
    async callback(code, state, error, errorDescription, res) {
        const redirectTo = await this.oauth.handleCallback({ code, state, error, error_description: errorDescription });
        res.redirect(redirectTo);
    }
};
__decorate([
    Get(':id/oauth/linkedin/start'),
    __param(0, Param('id')),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LinkedInOAuthController.prototype, "start", null);
__decorate([
    Get('oauth/linkedin/callback'),
    __param(0, Query('code')),
    __param(1, Query('state')),
    __param(2, Query('error')),
    __param(3, Query('error_description')),
    __param(4, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LinkedInOAuthController.prototype, "callback", null);
LinkedInOAuthController = __decorate([
    Controller('platforms'),
    __metadata("design:paramtypes", [LinkedInOAuthService])
], LinkedInOAuthController);
export { LinkedInOAuthController };
//# sourceMappingURL=linkedin-oauth.controller.js.map