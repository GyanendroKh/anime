import { OnEvent } from '@nestjs/event-emitter';
import { IAnimeListRet, IAnimeInfoRet, IAnimeEpisodeRet } from '@app/scrapper';
import { IEpisodeJob } from '../types';

export class GoGoAnimeListenerRun {
  @OnEvent('gogoanime.list-run.start', { async: true })
  async onListStart(pageNo: number) {
    console.log('List Run Started', pageNo);
  }

  @OnEvent('gogoanime.list-run.finish', { async: true })
  async onListCompleted(pageNo: number, data: IAnimeListRet) {
    console.log('List Run finish', pageNo, data);
  }

  @OnEvent('gogoanime.info-run.start', { async: true })
  async onInfoStart(link: string) {
    console.log('Info Run Start', link);
  }

  @OnEvent('gogoanime.info-run.finish', { async: true })
  async onInfoCompleted(link: string, data: IAnimeInfoRet) {
    console.log('Info Run finish', link, data);
  }

  @OnEvent('gogoanime.episode-run.start', { async: true })
  async onEpisodeStart(args: IEpisodeJob) {
    console.log('Episode Run Start', args);
  }

  @OnEvent('gogoanime.episode-run.finish', { async: true })
  async onEpisodeComplete(args: IEpisodeJob, data: IAnimeEpisodeRet) {
    console.log('Episode Run finish', args, data);
  }
}
