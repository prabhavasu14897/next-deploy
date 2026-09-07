import { HttpException, HttpStatus } from '@nestjs/common';

/** Thrown when a provider integration (AI or publish) is missing required
 *  env vars — surfaced to the frontend as a typed 503 it can show inline
 *  instead of a generic crash. */
export class ProviderNotConfiguredException extends HttpException {
  constructor(message: string) {
    super({ code: 'not_configured', message }, HttpStatus.SERVICE_UNAVAILABLE);
  }
}

/** Thrown when a configured provider's own API call fails (non-2xx, bad
 *  response shape). */
export class ProviderError extends HttpException {
  constructor(message: string) {
    super({ code: 'provider_error', message }, HttpStatus.BAD_GATEWAY);
  }
}
