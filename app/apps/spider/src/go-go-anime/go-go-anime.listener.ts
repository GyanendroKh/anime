import { OnEvent } from '@nestjs/event-emitter';
import { IAnimeEpisodeRet, IAnimeInfoRet, IAnimeListRet } from '@app/scrapper';
import { IEpisodeJob } from '../types';

export class GoGoAnimeListener {
  @OnEvent('gogoanime.list.start', { async: true })
  async onListStart(pageNo: number) {
    console.log('List Started', pageNo);
  }

  @OnEvent('gogoanime.list.finish', { async: true })
  async onListCompleted(pageNo: number, data: IAnimeListRet) {
    console.log('List finish', pageNo, data);
  }

  @OnEvent('gogoanime.info.start', { async: true })
  async onInfoStart(link: string) {
    console.log('Info Start', link);
  }

  @OnEvent('gogoanime.info.finish', { async: true })
  async onInfoCompleted(link: string, data: IAnimeInfoRet) {
    console.log('Info finish', link, data);
  }

  @OnEvent('gogoanime.episode.start', { async: true })
  async onEpisodeStart(args: IEpisodeJob) {
    console.log('Episode Start', args);
  }

  @OnEvent('gogoanime.episode.finish', { async: true })
  async onEpisodeComplete(args: IEpisodeJob, data: IAnimeEpisodeRet) {
    console.log('Episode finish', args, data);
  }
}
