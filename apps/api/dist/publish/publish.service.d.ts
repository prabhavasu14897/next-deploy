import type { PublishInput, PublishProvider, PublishResult } from './publish-provider.interface.js';
export declare class PublishService {
    private readonly providers;
    constructor(providers: PublishProvider[]);
    publish(platformKey: string, input: PublishInput): Promise<PublishResult>;
}
