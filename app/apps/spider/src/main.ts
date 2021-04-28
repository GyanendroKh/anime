import '@anime/env';
import { NestFactory } from '@nestjs/core';
import { SpiderModule } from './spider.module';

async function bootstrap() {
  const app = await NestFactory.create(SpiderModule, { cors: true });
  app.enableCors({
    origin: '*'
  });
  await app.listen(3001);
}
bootstrap();
