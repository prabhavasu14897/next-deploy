import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({ origin: true });
    const configService = app.get(ConfigService);
    const port = configService.get('PORT', 4000);
    await app.listen(port);
}
await bootstrap();
//# sourceMappingURL=main.js.map