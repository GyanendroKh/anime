import { NestFactory } from '@nestjs/core';
import { SpiderModule } from './spider.module';

async function bootstrap() {
  const app = await NestFactory.create(SpiderModule);
  await app.listen(3000);
}
bootstrap();
