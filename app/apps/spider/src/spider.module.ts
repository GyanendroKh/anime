import { HttpModule, Module } from '@nestjs/common';
import { SpiderController } from './spider.controller';
import { SpiderService } from './spider.service';
import { GoGoAnimeService } from './go-go-anime/go-go-anime.service';
import { GoGoAnimeController } from './go-go-anime/go-go-anime.controller';
import { GoGoAnimeRunner } from './go-go-anime/go-go-anime.runner';
import { GoGoAnimeState } from './go-go-anime/go-go-anime.state';
import { GoGoAnimeGateWay } from './go-go-anime/go-go-anime.gateway';

@Module({
  imports: [HttpModule],
  controllers: [SpiderController, GoGoAnimeController],
  providers: [
    SpiderService,
    GoGoAnimeService,
    GoGoAnimeRunner,
    GoGoAnimeState,
    GoGoAnimeGateWay
  ]
})
export class SpiderModule {}
