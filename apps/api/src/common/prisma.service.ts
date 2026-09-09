import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/prisma/client.js';

// Prisma 7's generated client takes a driver adapter explicitly rather
// than reading DATABASE_URL itself at runtime (that env var is only used
// by the Prisma CLI's migrate/generate, via prisma.config.ts). PrismaNeon
// is HTTP/WebSocket-based, suited to serverless — a plain TCP adapter would
// exhaust connections across concurrent Vercel function invocations.
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
