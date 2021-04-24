import { HttpModule, Module } from '@nestjs/common';
import { GoGoAnimeScrapper } from './gogoAnime.scrapper';

@Module({
  imports: [HttpModule],
  providers: [GoGoAnimeScrapper],
  exports: [GoGoAnimeScrapper]
})
export class GoGoAnimeScrapperModule {}
