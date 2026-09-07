import { ConfigService } from '@nestjs/config';
import type { PublishInput, PublishProvider, PublishResult } from '../publish-provider.interface.js';
export declare class LinkedInProvider implements PublishProvider {
    private readonly config;
    readonly key = "linkedin";
    constructor(config: ConfigService);
    publish({ imageBase64, caption }: PublishInput): Promise<PublishResult>;
}
