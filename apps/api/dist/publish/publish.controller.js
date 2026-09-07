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
import { Body, Controller, Param, Post } from '@nestjs/common';
import { PublishService } from './publish.service.js';
class PublishDto {
    imageBase64;
    caption;
}
let PublishController = class PublishController {
    publishService;
    constructor(publishService) {
        this.publishService = publishService;
    }
    publish(platformKey, body) {
        return this.publishService.publish(platformKey, body);
    }
};
__decorate([
    Post(':platformKey'),
    __param(0, Param('platformKey')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PublishDto]),
    __metadata("design:returntype", void 0)
], PublishController.prototype, "publish", null);
PublishController = __decorate([
    Controller('publish'),
    __metadata("design:paramtypes", [PublishService])
], PublishController);
export { PublishController };
//# sourceMappingURL=publish.controller.js.map