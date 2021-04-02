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
    this.state.getAnimeList().add(1);
  }
}
