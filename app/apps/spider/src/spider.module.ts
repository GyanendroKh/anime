import { HttpModule, Module } from '@nestjs/common';
import { SpiderController } from './spider.controller';
import { SpiderService } from './spider.service';
import { GoGoAnimeService } from './go-go-anime/go-go-anime.service';
import { GoGoAnimeController } from './go-go-anime/go-go-anime.controller';

@Module({
  imports: [HttpModule],
  controllers: [SpiderController, GoGoAnimeController],
  providers: [SpiderService, GoGoAnimeService]
})
export class SpiderModule {}
