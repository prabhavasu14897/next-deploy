import { Module } from '@nestjs/common';
import { PublishController } from './publish.controller.js';
import { PublishService } from './publish.service.js';
import { PUBLISH_PROVIDERS } from './publish-provider.interface.js';
import { LinkedInProvider } from './providers/linkedin.provider.js';
import { FacebookProvider } from './providers/facebook.provider.js';
import { PlatformsModule } from '../platforms/platforms.module.js';

@Module({
  imports: [PlatformsModule],
  controllers: [PublishController],
  providers: [
    LinkedInProvider,
    FacebookProvider,
    {
      provide: PUBLISH_PROVIDERS,
      useFactory: (linkedin: LinkedInProvider, facebook: FacebookProvider) => [linkedin, facebook],
      inject: [LinkedInProvider, FacebookProvider],
    },
    PublishService,
  ],
  exports: [PublishService],
})
export class PublishModule {}
