import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IAnimeListRet, IAnimeInfoRet, IAnimeEpisodeRet } from '@app/scrapper';
import { IEpisodeJob } from '../types';
import { GoGoAnimeRunner } from './go-go-anime.runner';
import { GoGoAnimeDatabase } from './go-go-anime.database';
import { GoGoAnimeSeries, Series } from '@app/database';

@Injectable()
export class GoGoAnimeListenerRun {
  constructor(
    private readonly runner: GoGoAnimeRunner,
    private readonly database: GoGoAnimeDatabase
  ) {}

  @OnEvent('gogoanime.genre-run.start', { async: true })
  async onGenreStart() {
    console.log('Genre Run Started');
  }

  @OnEvent('gogoanime.genre-run.finish', { async: true })
  async onGenreCompleted(_: null, genres: string[]) {
    console.log('Genre Run Completed', genres);
    this.database.addGenres(genres);

    this.runner.addListRun(1);
  }

  @OnEvent('gogoanime.list-run.start', { async: true })
  async onListStart(pageNo: number) {
    console.log('List Run Started', pageNo);
  }

  @OnEvent('gogoanime.list-run.finish', { async: true })
  async onListCompleted(pageNo: number, data: IAnimeListRet) {
    console.log('List Run finish', pageNo, data.pageNo);

    const next = pageNo + 1;

    for (const { link } of data.list) {
      const isCompleted = await this.database.getSeries(['link', link], {
        status: 'Completed'
      });

      if (isCompleted) {
        console.log('Skipping Info', link);
      } else {
        this.runner.addInfoRun(link);
      }
    }

    if (data.paginations.includes(next)) {
      this.runner.addListRun(next);
    }
  }

  @OnEvent('gogoanime.info-run.start', { async: true })
  async onInfoStart(link: string) {
    console.log('Info Run Start', link);
  }

  @OnEvent('gogoanime.info-run.finish', { async: true })
  async onInfoCompleted(link: string, data: IAnimeInfoRet) {
    console.log('Info Run finish', link);
    let series = await this.database.getSeries(['movieId', data.movieId]);

    if (series) {
      if (data.status && series.status !== data.status) {
        series.status = data.status;
      }
      await series.save();
    } else {
      const genres = await this.database.getGenres(data.genres);

      series = Series.create({
        title: data.title,
        type: data.type,
        thumbnail: data.image,
        summary: data.summary,
        released: data.released,
        status: data.status,
        genres: genres
      });

      const gogoAnime = GoGoAnimeSeries.create({
        movieId: data.movieId,
        link: data.link,
        series: series
      });

      await gogoAnime.save();
    }

    this.runner.addEpisodesRun(data.movieId, data.episodeCount);
  }

  @OnEvent('gogoanime.episodes-run.start', { async: true })
  async onEpisodeStart(args: IEpisodeJob) {
    console.log('Episode Run Start', args);
  }

  @OnEvent('gogoanime.episodes-run.finish', { async: true })
  async onEpisodeComplete(args: IEpisodeJob, data: IAnimeEpisodeRet) {
    console.log('Episode Run finish', args.link, data.movieId);

    await this.database.addEpisodes(data.movieId, data.episodes);
  }
}
