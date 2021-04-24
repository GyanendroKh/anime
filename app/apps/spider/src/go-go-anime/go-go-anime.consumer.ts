import { GoGoAnimeScrapper } from '@app/scrapper';
import {
  Process,
  Processor,
  OnQueueActive,
  OnQueueCompleted
} from '@nestjs/bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bull';

@Processor('gogoanime')
export class GoGoAnimeConsumer {
  constructor(
    private readonly scrapper: GoGoAnimeScrapper,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @OnQueueActive()
  async onQueueActive(job: Job) {
    this.eventEmitter.emit(`gogoanime.${job.name}.start`, job.data);
  }

  @OnQueueCompleted()
  async onQueueCompleted(job: Job<number>) {
    this.eventEmitter.emit(
      `gogoanime.${job.name}.finish`,
      job.data,
      job.returnvalue
    );
  }

  @Process('list')
  async getList(job: Job<number>) {
    const res = await this.scrapper.getAnimeList(job.data);

    return res;
  }

  @Process('info')
  async getInfo(job: Job<string>) {
    const res = await this.scrapper.getAnimeInfo(job.data);

    return res;
  }

  @Process('episodes')
  async getEpisodes(job: Job<{ link: string; count: number }>) {
    const res = await this.scrapper.getAnimeEpisodes(
      job.data.link,
      0,
      job.data.count
    );

    return res;
  }
}
