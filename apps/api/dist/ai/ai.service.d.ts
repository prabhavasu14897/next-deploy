import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private readonly config;
    constructor(config: ConfigService);
    private apiKey;
    generateImage(prompt: string): Promise<{
        imageBase64: string;
    }>;
    private generateImageFree;
    generateCaption(prompt: string, tone: string): Promise<{
        caption: string;
    }>;
    generateHashtags(content: string, platform: string): Promise<{
        hashtags: string[];
    }>;
    rewriteContent(content: string, action: 'improve' | 'shorten' | 'grammar', tone: string): Promise<{
        content: string;
    }>;
    private chat;
}
