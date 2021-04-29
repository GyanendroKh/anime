import { Controller, Get } from '@nestjs/common';
import { GoGoAnimeRunner } from './go-go-anime.runner';

@Controller('/gogoanime')
export class GoGoAnimeController {
  constructor(private readonly runner: GoGoAnimeRunner) {}

  @Get('/start')
  start() {
    this.runner.startRun();
  }

  @Get('/start/recent-release')
  startRecentRelease() {
    this.runner.startRecentRelease();
  }

  @Get('/start/anime-showcase')
  startAnimeShowcase() {
    this.runner.animeShowcaseRun();
  }

  @Get('/resume')
  resume() {
    this.runner.resume();
  }

  @Get('/pause')
  pause() {
    this.runner.pause();
  }

  @Get('/clear')
  clear() {
    this.runner.clear();
  }
}
