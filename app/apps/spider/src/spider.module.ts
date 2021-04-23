import { Module } from '@nestjs/common';
import { TYPEORM_MODULE } from '@app/database';
import { GoGoAnimeModule } from './go-go-anime/go-go-anime.module';

@Module({
  imports: [TYPEORM_MODULE, GoGoAnimeModule]
})
export class SpiderModule {}
