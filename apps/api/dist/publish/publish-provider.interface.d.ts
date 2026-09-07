export interface PublishInput {
    imageBase64: string;
    caption: string;
}
export interface PublishResult {
    externalPostId: string;
}
export interface PublishProvider {
    readonly key: string;
    publish(input: PublishInput): Promise<PublishResult>;
}
export declare const PUBLISH_PROVIDERS: unique symbol;
