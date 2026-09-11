import type { Response } from 'express';
import { LinkedInOAuthService } from './linkedin-oauth.service.js';
export declare class LinkedInOAuthController {
    private readonly oauth;
    constructor(oauth: LinkedInOAuthService);
    start(id: string, res: Response): Promise<void>;
    callback(code: string | undefined, state: string | undefined, error: string | undefined, errorDescription: string | undefined, res: Response): Promise<void>;
}
