import { GoGoAnimeScrapper } from '@app/scrapper';
import {
  Process,
  Processor,
  OnQueueActive,
  OnQueueCompleted
} from '@nestjs/bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bull';
import { IEpisodeJob, IRecentReleaseJob } from '../types';

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

  @Process('genre-run')
  getGenres() {
    return this.scrapper.getGenres();
  }

  @Process('list')
  getList(job: Job<number>) {
    return this.scrapper.getAnimeList(job.data);
  }

  @Process('list-run')
  getListRun(job: Job<number>) {
    return this.scrapper.getAnimeList(job.data);
  }

  @Process('info')
  getInfo(job: Job<string>) {
    return this.scrapper.getAnimeInfo(job.data);
  }

  @Process('info-run')
  getInfoRun(job: Job<string>) {
    return this.scrapper.getAnimeInfo(job.data);
  }

  @Process('episodes')
  getEpisodes(job: Job<IEpisodeJob>) {
    return this.scrapper.getAnimeEpisodes(job.data.movieId, 0, job.data.count);
  }

  @Process('episodes-run')
  getEpisodesRun(job: Job<IEpisodeJob>) {
    return this.scrapper.getAnimeEpisodes(job.data.movieId, 0, job.data.count);
  }

  @Process('recent-release-run')
  getRecentRelease({ data: { pageNo } }: Job<IRecentReleaseJob>) {
    return this.scrapper.getRecentRelease(pageNo);
  }
}
