import { HttpModule, Module } from '@nestjs/common';
import { GoGoAnimeController } from './go-go-anime.controller';
import { GoGoAnimeGateWay } from './go-go-anime.gateway';
import { GoGoAnimeRunner } from './go-go-anime.runner';
import { GoGoAnimeService } from './go-go-anime.service';
import { GoGoAnimeState } from './go-go-anime.state';

@Module({
  imports: [HttpModule],
  controllers: [GoGoAnimeController],
  providers: [
    GoGoAnimeService,
    GoGoAnimeRunner,
    GoGoAnimeState,
    GoGoAnimeGateWay
  ]
})
export class GoGoAnimeModule {}
