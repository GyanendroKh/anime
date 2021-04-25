import { Controller, Get } from '@nestjs/common';
import { GoGoAnimeRunner } from './go-go-anime.runner';

@Controller('/gogoanime')
export class GoGoAnimeController {
  constructor(private readonly runner: GoGoAnimeRunner) {}

  @Get('/start')
  start() {
    this.runner.startGenreRun();
  }
}
