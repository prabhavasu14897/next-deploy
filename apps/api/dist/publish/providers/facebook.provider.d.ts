import type { PublishInput, PublishProvider, PublishResult } from '../publish-provider.interface.js';
export declare class FacebookProvider implements PublishProvider {
    readonly key = "facebook";
    publish({ imageBase64, caption, credentials }: PublishInput): Promise<PublishResult>;
}
