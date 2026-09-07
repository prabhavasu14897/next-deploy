import { HttpException } from '@nestjs/common';
export declare class PublishProviderNotSupportedException extends HttpException {
    constructor(platformKey: string);
}
