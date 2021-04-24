import { Module } from '@nestjs/common';
import { TYPEORM_MODULE } from '@app/database';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GoGoAnimeModule } from './go-go-anime/go-go-anime.module';

@Module({
  imports: [
    TYPEORM_MODULE,
    EventEmitterModule.forRoot({ global: true }),
    BullModule.forRoot({}),
    GoGoAnimeModule
  ]
})
export class SpiderModule {}
