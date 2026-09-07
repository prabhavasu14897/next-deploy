import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service.js';

class GenerateImageDto {
  prompt!: string;
}

class GenerateCaptionDto {
  prompt!: string;
  tone!: string;
}

class GenerateHashtagsDto {
  content!: string;
  platform!: string;
}

class RewriteDto {
  content!: string;
  action!: 'improve' | 'shorten' | 'grammar';
  tone!: string;
}

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-image')
  generateImage(@Body() body: GenerateImageDto) {
    return this.aiService.generateImage(body.prompt);
  }

  @Post('generate-caption')
  generateCaption(@Body() body: GenerateCaptionDto) {
    return this.aiService.generateCaption(body.prompt, body.tone);
  }

  @Post('generate-hashtags')
  generateHashtags(@Body() body: GenerateHashtagsDto) {
    return this.aiService.generateHashtags(body.content, body.platform);
  }

  @Post('rewrite')
  rewrite(@Body() body: RewriteDto) {
    return this.aiService.rewriteContent(body.content, body.action, body.tone);
  }
}
