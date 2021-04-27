import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IAnimeListRet, IAnimeInfoRet, IAnimeEpisodeRet } from '@app/scrapper';
import { GoGoAnimeSeries, Series } from '@app/database';
import { GoGoAnimeRunner } from './go-go-anime.runner';
import { GoGoAnimeDatabase } from './go-go-anime.database';
import { IEpisodeJob } from '../types';

@Injectable()
export class GoGoAnimeListenerRun {
  private readonly logger: Logger;

  constructor(
    private readonly runner: GoGoAnimeRunner,
    private readonly database: GoGoAnimeDatabase
  ) {
    this.logger = new Logger(GoGoAnimeListenerRun.name);
  }

  @OnEvent('gogoanime.genre-run.start', { async: true })
  async onGenreStart() {
    this.logger.log('Genre Run Started.');
  }

  @OnEvent('gogoanime.genre-run.finish', { async: true })
  async onGenreCompleted(_: null, genres: string[]) {
    this.logger.log('Genre Run Finish.');

    this.database.addGenres(genres);

    this.runner.addListRun(1);
  }

  @OnEvent('gogoanime.list-run.start', { async: true })
  async onListStart(pageNo: number) {
    this.logger.log(`List Run Start ${pageNo}`);
  }

  @OnEvent('gogoanime.list-run.finish', { async: true })
  async onListCompleted(pageNo: number, data: IAnimeListRet) {
    this.logger.log(`List Run Finish ${pageNo} ${data.list.length}`);

    const next = pageNo + 1;

    for (const { link } of data.list) {
      const isCompleted = await this.database.getSeries(['link', link], {
        status: 'Completed'
      });

      if (isCompleted) {
        this.runner.skipInfoRun(link);
      } else {
        this.runner.addInfoRun(link);
      }
    }

    if (data.paginations.includes(next)) {
      this.runner.addListRun(next);
    }
  }

  @OnEvent('gogoanime.info-run.skip', { async: true })
  async onInfoSkip(link: string) {
    this.logger.log(`Info Skip ${link}`);
  }

  @OnEvent('gogoanime.info-run.start', { async: true })
  async onInfoStart(link: string) {
    this.logger.log(`Info Run Start ${link}`);
  }

  @OnEvent('gogoanime.info-run.finish', { async: true })
  async onInfoCompleted(link: string, data: IAnimeInfoRet) {
    this.logger.log(`Info Run Finish ${link} ${data.movieId}`);

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

  @OnEvent('gogoanime.episodes-run.skip', { async: true })
  async onEpisodesSkip(movieId: string) {
    this.logger.log(`Episodes Run Skip ${movieId}`);
  }

  @OnEvent('gogoanime.episodes-run.start', { async: true })
  async onEpisodesStart({ movieId }: IEpisodeJob) {
    this.logger.log(`Episodes Run Start ${movieId}`);
  }

  @OnEvent('gogoanime.episodes-run.finish', { async: true })
  async onEpisodesComplete({ movieId }: IEpisodeJob, data: IAnimeEpisodeRet) {
    this.logger.log(`Episodes Run Finish ${movieId} ${data.episodes.length}`);

    await this.database.addEpisodes(data.movieId, data.episodes);
  }
}
