import type { IncomingMessage, ServerResponse } from 'node:http';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { type Express } from 'express';
import { AppModule } from '../src/app.module.js';

// Vercel's Node.js runtime invokes this module's default export directly with
// a plain (req, res) — the same shape a Node http server passes to a request
// listener. An Express app IS a valid request listener, so it can be handed
// to Vercel as-is; no Lambda-style (event, context) adapter is needed here.
//
// Warm invocations reuse this module's scope — cache the built app so a warm
// request skips re-bootstrapping the whole Nest app.
let cachedApp: Express | undefined;

async function getApp(): Promise<Express> {
  if (cachedApp) return cachedApp;

  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  app.enableCors({ origin: true });
  await app.init();

  cachedApp = expressApp;
  return cachedApp;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const expressApp = await getApp();
  expressApp(req, res);
}

export const config = {
  maxDuration: 60,
};
