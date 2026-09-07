import { ConfigService } from '@nestjs/config';
import type { PublishInput, PublishProvider, PublishResult } from '../publish-provider.interface.js';
export declare class FacebookProvider implements PublishProvider {
    private readonly config;
    readonly key = "facebook";
    constructor(config: ConfigService);
    publish({ imageBase64, caption }: PublishInput): Promise<PublishResult>;
}
