import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { LinkedInOAuthService } from './linkedin-oauth.service.js';

@Controller('platforms')
export class LinkedInOAuthController {
  constructor(private readonly oauth: LinkedInOAuthService) {}

  // Starting URL is per-platform-id (so the "Connect with LinkedIn" button
  // knows which platform record to update), but the callback URL below is
  // fixed — that's the one registered as an "Authorized redirect URL" in
  // the LinkedIn app's own settings, and LinkedIn requires it to match
  // exactly, so it can't carry a dynamic id.
  @Get(':id/oauth/linkedin/start')
  async start(@Param('id') id: string, @Res() res: Response) {
    const url = await this.oauth.buildAuthorizeUrl(id);
    res.redirect(url);
  }

  @Get('oauth/linkedin/callback')
  async callback(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Query('error_description') errorDescription: string | undefined,
    @Res() res: Response,
  ) {
    const redirectTo = await this.oauth.handleCallback({ code, state, error, error_description: errorDescription });
    res.redirect(redirectTo);
  }
}
