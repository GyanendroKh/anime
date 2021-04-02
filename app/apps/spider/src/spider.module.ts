import { Module } from '@nestjs/common';
import { GoGoAnimeModule } from './go-go-anime/go-go-anime.module';

@Module({
  imports: [GoGoAnimeModule]
})
export class SpiderModule {}
