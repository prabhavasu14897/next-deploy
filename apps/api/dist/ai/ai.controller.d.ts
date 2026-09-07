import { AiService } from './ai.service.js';
declare class GenerateImageDto {
    prompt: string;
}
declare class GenerateCaptionDto {
    prompt: string;
    tone: string;
}
declare class GenerateHashtagsDto {
    content: string;
    platform: string;
}
declare class RewriteDto {
    content: string;
    action: 'improve' | 'shorten' | 'grammar';
    tone: string;
}
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generateImage(body: GenerateImageDto): Promise<{
        imageBase64: string;
    }>;
    generateCaption(body: GenerateCaptionDto): Promise<{
        caption: string;
    }>;
    generateHashtags(body: GenerateHashtagsDto): Promise<{
        hashtags: string[];
    }>;
    rewrite(body: RewriteDto): Promise<{
        content: string;
    }>;
}
export {};
