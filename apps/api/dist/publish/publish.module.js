var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { PublishController } from './publish.controller.js';
import { PublishService } from './publish.service.js';
import { PUBLISH_PROVIDERS } from './publish-provider.interface.js';
import { LinkedInProvider } from './providers/linkedin.provider.js';
import { FacebookProvider } from './providers/facebook.provider.js';
let PublishModule = class PublishModule {
};
PublishModule = __decorate([
    Module({
        controllers: [PublishController],
        providers: [
            LinkedInProvider,
            FacebookProvider,
            {
                provide: PUBLISH_PROVIDERS,
                useFactory: (linkedin, facebook) => [linkedin, facebook],
                inject: [LinkedInProvider, FacebookProvider],
            },
            PublishService,
        ],
        exports: [PublishService],
    })
], PublishModule);
export { PublishModule };
//# sourceMappingURL=publish.module.js.map