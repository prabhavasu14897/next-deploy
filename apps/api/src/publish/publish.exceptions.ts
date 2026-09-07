import { HttpException, HttpStatus } from '@nestjs/common';

export class PublishProviderNotSupportedException extends HttpException {
  constructor(platformKey: string) {
    super(
      {
        code: 'not_supported',
        message: `No publish integration is registered for "${platformKey}" yet.`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
