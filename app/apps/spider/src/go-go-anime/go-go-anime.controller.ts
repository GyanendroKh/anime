import { Controller, Get } from '@nestjs/common';
import { GoGoAnimeRunner } from './go-go-anime.runner';

@Controller('gogoanime')
export class GoGoAnimeController {
  constructor(private readonly runner: GoGoAnimeRunner) {}

  @Get('/start')
  start() {
    this.runner.start();
  }

  @Get('/stop')
  stop() {
    this.runner.stop();
  }

  @Get('/state/isRunning')
  isRunning() {
    return {
      isRunning: this.runner.isRunning()
    };
  }
}
