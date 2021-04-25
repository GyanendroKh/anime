import { OnEvent } from '@nestjs/event-emitter';
import { IAnimeListRet, IAnimeInfoRet, IAnimeEpisodeRet } from '@app/scrapper';
import { IEpisodeJob } from '../types';
import { GoGoAnimeRunner } from './go-go-anime.runner';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoGoAnimeListenerRun {
  constructor(private readonly runner: GoGoAnimeRunner) {}

  @OnEvent('gogoanime.genre-run.start', { async: true })
  async onGenreStart() {
    console.log('Genre Run Started');
  }

  @OnEvent('gogoanime.genre-run.finish', { async: true })
  async onGenreCompleted(_: null, genres: string[]) {
    console.log('Genre Run Completed', genres);
    this.runner.addListRun(1);
  }

  @OnEvent('gogoanime.list-run.start', { async: true })
  async onListStart(pageNo: number) {
    console.log('List Run Started', pageNo);
  }

  @OnEvent('gogoanime.list-run.finish', { async: true })
  async onListCompleted(pageNo: number, data: IAnimeListRet) {
    console.log('List Run finish', pageNo, data);

    const next = pageNo + 1;

    if (data.paginations.includes(next)) {
      this.runner.addListRun(next);
    }

    data.list.forEach(l => {
      this.runner.addInfoRun(l.link);
    });
  }

  @OnEvent('gogoanime.info-run.start', { async: true })
  async onInfoStart(link: string) {
    console.log('Info Run Start', link);
  }

  @OnEvent('gogoanime.info-run.finish', { async: true })
  async onInfoCompleted(link: string, data: IAnimeInfoRet) {
    console.log('Info Run finish', link, data);

    this.runner.addEpisodesRun(data.link, data.episodeCount);
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
