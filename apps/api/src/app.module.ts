// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { createObserveModule } from '@nestjs/observe';
// import { AppController } from './app.controller.js';
// import { AppService } from './app.service.js';

// export const { ObserveModule, ObserveInstrument } = createObserveModule();

// @Module({
//   imports: [
//      ConfigModule.forRoot({
//       isGlobal: true,
//     }),

//     // Distributed tracing, auto-correlated logs, request/job metrics, error
//     // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
//     ObserveModule.forRoot({
//       appKey: process.env.OBSERVE_APP_KEY ?? '',
//       appSecret: process.env.OBSERVE_APP_SECRET ?? '',
//       serviceId: process.env.OBSERVE_SERVICE_ID ?? 'api',
//     }),
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}