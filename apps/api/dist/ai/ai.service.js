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
import { ProviderError } from '../common/provider-exceptions.js';
const OPENAI_IMAGES_URL = 'https://api.openai.com/v1/images/generations';
const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';
const POLLINATIONS_IMAGE_URL = 'https://image.pollinations.ai/prompt';
const TONE_EMOJI = {
    professional: '💼',
    casual: '😊',
    enthusiastic: '🚀',
    formal: '📋',
};
let AiService = class AiService {
    config;
    constructor(config) {
        this.config = config;
    }
    apiKey() {
        return this.config.get('OPENAI_API_KEY') ?? null;
    }
    async generateImage(prompt) {
        const apiKey = this.apiKey();
        if (!apiKey)
            return this.generateImageFree(prompt);
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
    async generateImageFree(prompt) {
        const url = `${POLLINATIONS_IMAGE_URL}/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new ProviderError(await describeError('Free image generation', response));
        }
        const bytes = Buffer.from(await response.arrayBuffer());
        return { imageBase64: bytes.toString('base64') };
    }
    async generateCaption(prompt, tone) {
        const apiKey = this.apiKey();
        if (!apiKey)
            return { caption: templateCaption(prompt, tone) };
        const caption = await this.chat(apiKey, `Write a complete, ready-to-publish social media post based on the brief below, in a ${tone} tone. Use relevant emoji naturally where it fits. Reply with only the post text — no preamble, no hashtags (those are generated separately), no quotes.`, prompt);
        if (!caption) {
            throw new ProviderError('OpenAI returned no caption text.');
        }
        return { caption };
    }
    async generateHashtags(content, platform) {
        const apiKey = this.apiKey();
        if (!apiKey)
            return { hashtags: templateHashtags(content) };
        const text = await this.chat(apiKey, `Generate 5-8 relevant hashtags for a ${platform} post. Reply with only the hashtags, space-separated, each starting with #. No other text.`, content);
        const hashtags = (text ?? '').split(/\s+/).filter((tag) => tag.startsWith('#'));
        return { hashtags };
    }
    async rewriteContent(content, action, tone) {
        const apiKey = this.apiKey();
        if (!apiKey)
            return { content: templateRewrite(content, action) };
        const instruction = REWRITE_INSTRUCTIONS[action](tone);
        const rewritten = await this.chat(apiKey, `${instruction} Reply with only the rewritten post text, no preamble, no quotes.`, content);
        if (!rewritten) {
            throw new ProviderError('OpenAI returned no rewritten text.');
        }
        return { content: rewritten };
    }
    async chat(apiKey, system, user) {
        const response = await fetch(OPENAI_CHAT_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: system },
                    { role: 'user', content: user },
                ],
            }),
        });
        if (!response.ok) {
            throw new ProviderError(await describeError('OpenAI chat', response));
        }
        const body = (await response.json());
        return body.choices?.[0]?.message?.content?.trim();
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
function templateCaption(prompt, tone) {
    const brief = prompt.trim().replace(/\s+/g, ' ');
    const emoji = TONE_EMOJI[tone] ?? '✨';
    const sentence = brief.charAt(0).toUpperCase() + brief.slice(1);
    const closer = sentence.endsWith('.') || sentence.endsWith('!') || sentence.endsWith('?') ? '' : '.';
    return `${emoji} ${sentence}${closer}`;
}
const STOPWORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'for', 'with', 'is', 'are',
    'was', 'were', 'be', 'this', 'that', 'our', 'your', 'we', 'you', 'it', 'at', 'as', 'by',
]);
function templateHashtags(content) {
    const words = content
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOPWORDS.has(w));
    const unique = [...new Set(words)].slice(0, 6);
    return unique.map((w) => `#${w.charAt(0).toUpperCase()}${w.slice(1)}`);
}
function templateRewrite(content, action) {
    const trimmed = content.trim().replace(/\s+/g, ' ');
    if (action === 'shorten') {
        const half = Math.max(1, Math.ceil(trimmed.length / 2));
        const cut = trimmed.slice(0, half);
        return cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : cut.length).trim() + '…';
    }
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    return /[.!?]$/.test(capitalized) ? capitalized : `${capitalized}.`;
}
async function describeError(label, response) {
    const text = await response.text().catch(() => '');
    return `${label} failed (${response.status}): ${text.slice(0, 300)}`;
}
//# sourceMappingURL=ai.service.js.map