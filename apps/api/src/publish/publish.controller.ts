import { Body, Controller, Param, Post } from '@nestjs/common';
import { PublishService } from './publish.service.js';

class PublishDto {
  imageBase64!: string;
  caption!: string;
}

@Controller('publish')
export class PublishController {
  constructor(private readonly publishService: PublishService) {}

  @Post(':platformKey')
  publish(@Param('platformKey') platformKey: string, @Body() body: PublishDto) {
    return this.publishService.publish(platformKey, body);
  }
}
