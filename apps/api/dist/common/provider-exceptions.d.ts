import { HttpException } from '@nestjs/common';
export declare class ProviderNotConfiguredException extends HttpException {
    constructor(message: string);
}
export declare class ProviderError extends HttpException {
    constructor(message: string);
}
