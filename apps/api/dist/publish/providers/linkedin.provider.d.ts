import type { PublishInput, PublishProvider, PublishResult } from '../publish-provider.interface.js';
export declare class LinkedInProvider implements PublishProvider {
    readonly key = "linkedin";
    publish({ imageBase64, caption, credentials }: PublishInput): Promise<PublishResult>;
}
