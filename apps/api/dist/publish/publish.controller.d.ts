import { PublishService } from './publish.service.js';
declare class PublishDto {
    imageBase64: string;
    caption: string;
}
export declare class PublishController {
    private readonly publishService;
    constructor(publishService: PublishService);
    publish(platformKey: string, body: PublishDto): Promise<import("./publish-provider.interface.js").PublishResult>;
}
export {};
