import { Module } from '@nestjs/common';
import { TYPEORM_MODULE } from '../../../libs/database/src';
import { GoGoAnimeModule } from './go-go-anime/go-go-anime.module';

@Module({
  imports: [TYPEORM_MODULE, GoGoAnimeModule]
})
export class SpiderModule {}
