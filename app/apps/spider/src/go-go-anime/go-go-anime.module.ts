import {
  HttpModule,
  MiddlewareConsumer,
  Module,
  NestModule
} from '@nestjs/common';
import { GoGoAnimeScrapperModule } from '@app/scrapper';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { router, setQueues, BullAdapter } from 'bull-board';
import { GoGoAnimeConsumer } from './go-go-anime.consumer';
import { GoGoAnimeListener } from './go-go-anime.listener';
import { GoGoAnimeRunner } from './go-go-anime.runner';
import { GoGoAnimeListenerRun } from './go-go-anime.listener.run';
import { GoGoAnimeController } from './go-go-anime.controller';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: 'gogoanime'
    }),
    GoGoAnimeScrapperModule
  ],
  controllers: [GoGoAnimeController],
  providers: [
    GoGoAnimeConsumer,
    GoGoAnimeListener,
    GoGoAnimeListenerRun,
    GoGoAnimeRunner
  ]
})
export class GoGoAnimeModule implements NestModule {
  constructor(
    @InjectQueue('gogoanime')
    private readonly queue: Queue
  ) {
    setQueues([new BullAdapter(this.queue)]);
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(router).forRoutes('/gogoanime/bullboard');
  }
}
