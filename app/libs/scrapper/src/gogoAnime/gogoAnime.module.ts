import { DynamicModule, HttpModule, Module } from '@nestjs/common';
import { GoGoAnimeScrapper } from './gogoAnime.scrapper';

@Module({
  imports: [HttpModule],
  providers: [GoGoAnimeScrapper],
  exports: [GoGoAnimeScrapper]
})
export class GoGoAnimeScrapperModule {
  static forRoot(): DynamicModule {
    return {
      module: GoGoAnimeScrapperModule,
      providers: [GoGoAnimeScrapper],
      exports: [GoGoAnimeScrapper],
      global: true
    };
  }
}
