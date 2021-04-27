import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IAnimeEpisodeRet, IAnimeInfoRet, IAnimeListRet } from '@app/scrapper';
import { IEpisodeJob } from '../types';

@Injectable()
export class GoGoAnimeListener {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(GoGoAnimeListener.name);
  }

  @OnEvent('gogoanime.list.start', { async: true })
  async onListStart(pageNo: number) {
    this.logger.log(`List Started ${pageNo}`);
  }

  @OnEvent('gogoanime.list.finish', { async: true })
  async onListCompleted(pageNo: number, data: IAnimeListRet) {
    this.logger.log(`List Finish ${pageNo} ${data.list.length}`);
  }

  @OnEvent('gogoanime.info.start', { async: true })
  async onInfoStart(link: string) {
    this.logger.log(`Info Start ${link}`);
  }

  @OnEvent('gogoanime.info.finish', { async: true })
  async onInfoCompleted(link: string, data: IAnimeInfoRet) {
    this.logger.log(`Info Finish ${link} ${data.movieId}`);
  }

  @OnEvent('gogoanime.episodes.start', { async: true })
  async onEpisodesStart({ movieId }: IEpisodeJob) {
    this.logger.log(`Epidoes Start ${movieId}`);
  }

  @OnEvent('gogoanime.episodes.finish', { async: true })
  async onEpisodesComplete({ movieId }: IEpisodeJob, data: IAnimeEpisodeRet) {
    this.logger.log(`Episodes Finish ${movieId} ${data.episodes.length}`);
  }
}
