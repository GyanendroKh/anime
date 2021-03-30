import { Controller, Get } from '@nestjs/common';
import { GoGoAnimeRunner } from './go-go-anime.runner';
import { GoGoAnimeState } from './go-go-anime.state';

@Controller('gogoanime')
export class GoGoAnimeController {
  constructor(
    private readonly runner: GoGoAnimeRunner,
    private readonly state: GoGoAnimeState
  ) {
    this.runner.subscribe();
  }

  @Get('/startFresh')
  startFresh() {
    this.runner.startFresh();
  }

  @Get('/startInfo')
  startInfo() {
    this.runner.startInfo();
  }

  @Get('/startEpisodes')
  startEpisodes() {
    this.runner.startEpisodes();
  }

  @Get('/state/animeinfo')
  stateAnimeInfo() {
    return this.state.getAnimeInfo().getData();
  }
}
