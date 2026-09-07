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
import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service.js';
class GenerateImageDto {
    prompt;
}
class GenerateCaptionDto {
    prompt;
    tone;
}
class GenerateHashtagsDto {
    content;
    platform;
}
class RewriteDto {
    content;
    action;
    tone;
}
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    generateImage(body) {
        return this.aiService.generateImage(body.prompt);
    }
    generateCaption(body) {
        return this.aiService.generateCaption(body.prompt, body.tone);
    }
    generateHashtags(body) {
        return this.aiService.generateHashtags(body.content, body.platform);
    }
    rewrite(body) {
        return this.aiService.rewriteContent(body.content, body.action, body.tone);
    }
};
__decorate([
    Post('generate-image'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenerateImageDto]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "generateImage", null);
__decorate([
    Post('generate-caption'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenerateCaptionDto]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "generateCaption", null);
__decorate([
    Post('generate-hashtags'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenerateHashtagsDto]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "generateHashtags", null);
__decorate([
    Post('rewrite'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RewriteDto]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "rewrite", null);
AiController = __decorate([
    Controller('ai'),
    __metadata("design:paramtypes", [AiService])
], AiController);
export { AiController };
//# sourceMappingURL=ai.controller.js.map