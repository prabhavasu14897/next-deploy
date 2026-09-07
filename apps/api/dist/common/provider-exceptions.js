import { HttpException, HttpStatus } from '@nestjs/common';
export class ProviderNotConfiguredException extends HttpException {
    constructor(message) {
        super({ code: 'not_configured', message }, HttpStatus.SERVICE_UNAVAILABLE);
    }
}
export class ProviderError extends HttpException {
    constructor(message) {
        super({ code: 'provider_error', message }, HttpStatus.BAD_GATEWAY);
    }
}
//# sourceMappingURL=provider-exceptions.js.map