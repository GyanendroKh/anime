import {
  HttpModule,
  MiddlewareConsumer,
  Module,
  NestModule
} from '@nestjs/common';
import { GoGoAnimeScrapperModule } from '@app/scrapper';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Episode,
  Genre,
  GoGoAnimeEpisode,
  GoGoAnimeSeries,
  Series
} from '@app/database';
import { Queue } from 'bull';
import { router, setQueues, BullAdapter } from 'bull-board';
import { GoGoAnimeConsumer } from './go-go-anime.consumer';
import { GoGoAnimeListener } from './go-go-anime.listener';
import { GoGoAnimeRunner } from './go-go-anime.runner';
import { GoGoAnimeListenerRun } from './go-go-anime.listener.run';
import { GoGoAnimeController } from './go-go-anime.controller';
import { GoGoAnimeDatabase } from './go-go-anime.database';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Genre,
      Series,
      GoGoAnimeSeries,
      Episode,
      GoGoAnimeEpisode
    ]),
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
    GoGoAnimeRunner,
    GoGoAnimeDatabase
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
