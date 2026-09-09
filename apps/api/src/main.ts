// import { NestFactory } from '@nestjs/core';
// import { ConfigService } from '@nestjs/config';
// import { AppModule, ObserveInstrument } from './app.module.js';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, {
//     instrument: ObserveInstrument,
//   });
  
//   const configService = app.get(ConfigService);
//   const port = configService.get<number>('PORT', 4000);

//   await app.listen(port);
// }
// await bootstrap();

import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // The Next.js dev server runs on a different port — allow it to call this API.
  app.enableCors({ origin: true });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);

  await app.listen(port);
}

await bootstrap();