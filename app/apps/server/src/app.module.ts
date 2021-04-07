import { Module } from '@nestjs/common';
import { TYPEORM_MODULE } from '@app/database';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TYPEORM_MODULE],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
