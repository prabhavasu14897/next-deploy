var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderError, ProviderNotConfiguredException } from '../common/provider-exceptions.js';
const OPENAI_IMAGES_URL = 'https://api.openai.com/v1/images/generations';
const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';
let AiService = class AiService {
    config;
    constructor(config) {
        this.config = config;
    }
    apiKey() {
        const key = this.config.get('OPENAI_API_KEY');
        if (!key) {
            throw new ProviderNotConfiguredException("AI generation isn't configured yet — set OPENAI_API_KEY on the API server.");
        }
        return key;
    }
    async generateImage(prompt) {
        const apiKey = this.apiKey();
        const response = await fetch(OPENAI_IMAGES_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-image-1',
                prompt,
                size: '1024x1024',
            }),
        });
        if (!response.ok) {
            throw new ProviderError(await describeError('OpenAI image generation', response));
        }
        const body = (await response.json());
        const imageBase64 = body.data?.[0]?.b64_json;
        if (!imageBase64) {
            throw new ProviderError('OpenAI returned no image data.');
        }
        return { imageBase64 };
    }
    async generateCaption(prompt, tone) {
        const apiKey = this.apiKey();
        const response = await fetch(OPENAI_CHAT_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `Write a complete, ready-to-publish social media post based on the brief below, in a ${tone} tone. Use relevant emoji naturally where it fits. Reply with only the post text — no preamble, no hashtags (those are generated separately), no quotes.`,
                    },
                    { role: 'user', content: prompt },
                ],
            }),
        });
        if (!response.ok) {
            throw new ProviderError(await describeError('OpenAI caption generation', response));
        }
        const body = (await response.json());
        const caption = body.choices?.[0]?.message?.content?.trim();
        if (!caption) {
            throw new ProviderError('OpenAI returned no caption text.');
        }
        return { caption };
    }
    async generateHashtags(content, platform) {
        const apiKey = this.apiKey();
        const response = await fetch(OPENAI_CHAT_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `Generate 5-8 relevant hashtags for a ${platform} post. Reply with only the hashtags, space-separated, each starting with #. No other text.`,
                    },
                    { role: 'user', content },
                ],
            }),
        });
        if (!response.ok) {
            throw new ProviderError(await describeError('OpenAI hashtag generation', response));
        }
        const body = (await response.json());
        const text = body.choices?.[0]?.message?.content ?? '';
        const hashtags = text.split(/\s+/).filter((tag) => tag.startsWith('#'));
        return { hashtags };
    }
    async rewriteContent(content, action, tone) {
        const apiKey = this.apiKey();
        const instruction = REWRITE_INSTRUCTIONS[action](tone);
        const response = await fetch(OPENAI_CHAT_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `${instruction} Reply with only the rewritten post text, no preamble, no quotes.`,
                    },
                    { role: 'user', content },
                ],
            }),
        });
        if (!response.ok) {
            throw new ProviderError(await describeError('OpenAI rewrite', response));
        }
        const body = (await response.json());
        const rewritten = body.choices?.[0]?.message?.content?.trim();
        if (!rewritten) {
            throw new ProviderError('OpenAI returned no rewritten text.');
        }
        return { content: rewritten };
    }
};
AiService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], AiService);
export { AiService };
const REWRITE_INSTRUCTIONS = {
    improve: (tone) => `Rewrite the following social media post to read better, in a ${tone} tone. Keep the same meaning and length range.`,
    shorten: (tone) => `Shorten the following social media post to roughly half its length, in a ${tone} tone, keeping the key message.`,
    grammar: () => 'Fix any grammar, spelling, and punctuation issues in the following social media post without changing its tone, meaning, or length.',
};
async function describeError(label, response) {
    const text = await response.text().catch(() => '');
    return `${label} failed (${response.status}): ${text.slice(0, 300)}`;
}
//# sourceMappingURL=ai.service.js.map