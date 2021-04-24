import {
  HttpModule,
  MiddlewareConsumer,
  Module,
  NestModule
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre, GoGoAnimeSeries, Series } from '@app/database/entity';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { router, setQueues, BullAdapter } from 'bull-board';
import { GoGoAnimeConsumer } from './go-go-anime.consumer';
import { GoGoAnimeListener } from './go-go-anime.listener';
import { GoGoAnimeService } from './go-go-anime.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Series, Genre, GoGoAnimeSeries]),
    BullModule.registerQueue({
      name: 'gogoanime'
    })
  ],
  providers: [GoGoAnimeConsumer, GoGoAnimeListener, GoGoAnimeService]
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
