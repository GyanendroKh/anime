import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IAnimeListRet,
  IAnimeInfoRet,
  IAnimeEpisodeRet,
  GoGoAnimeScrapper
} from '@app/scrapper';
import { of } from 'rxjs';
import { reduce, mergeMap, tap } from 'rxjs/operators';
import { GoGoAnimeRunner } from './go-go-anime.runner';
import { GoGoAnimeDatabase } from './go-go-anime.database';
import { IEpisodeJob, IRecentReleaseJob } from '../types';

@Injectable()
export class GoGoAnimeListenerRun {
  private readonly logger: Logger;

  constructor(
    private readonly runner: GoGoAnimeRunner,
    private readonly database: GoGoAnimeDatabase,
    private readonly scrapper: GoGoAnimeScrapper
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

    await this.database.addGenres(genres);

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

    const series = await this.database.getSeries(['movieId', data.movieId]);

    if (series) {
      if (data.status && series.status !== data.status) {
        series.status = data.status;
      }

      await series.save();
    } else {
      await this.database.addSeries(data);
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

  @OnEvent('gogoanime.recent-release-run.start', { async: true })
  async onRecentReleaseStart({ pageNo }: IRecentReleaseJob) {
    this.logger.log(`Recent Release Start ${pageNo}`);
  }

  @OnEvent('gogoanime.recent-release-run.finish', { async: true })
  async onRecentReleaseFinish(
    { pageNo, extras }: IRecentReleaseJob,
    data: IAnimeListRet
  ) {
    this.logger.log(`Recent Release Finish ${pageNo} ${data.list.length}`);

    const links = data.list.map(l => l.link);

    const episodes = await this.database.getEpisodes(links);
    const existLinks = episodes.map(e => e.link);

    const missingLinks = links.filter(l => !existLinks.includes(l));

    const movieIds = await of(...missingLinks)
      .pipe(
        mergeMap(l => this.scrapper.getAnimeEpisodeSeries(l), 10),
        reduce<IAnimeInfoRet, IAnimeInfoRet[]>((acc, curr) => {
          acc.push(curr);
          return acc;
        }, [])
      )
      .toPromise();

    const newExtras = [...extras, ...movieIds];

    if (pageNo === 10) {
      this.runner.processRecentRelease(newExtras);
      return;
    }

    const next = pageNo + 1;

    if (data.paginations.includes(next)) {
      this.runner.addRecentRelease(next, newExtras);
    }
  }

  @OnEvent('recent-release-process', { async: true })
  async recentReleaseProcess(episodeJobs: IAnimeInfoRet[]) {
    this.logger.log(`Recent Release Process ${episodeJobs.length}`);

    const uniqueJobs = new Set(episodeJobs);

    await of(...uniqueJobs)
      .pipe(
        mergeMap(async job => {
          const series = await this.database.existSeries([job.movieId]);
          const exist = series.length === 1;

          return {
            exist,
            job
          };
        }, 10),
        tap(({ exist, job }) => {
          this.logger.log(`Recent Release Process Job ${job.movieId} ${exist}`);

          const { link, movieId, episodeCount } = job;

          if (exist) {
            this.runner.addEpisodesRun(movieId, episodeCount);
          } else {
            this.runner.emitInfoRunFinish(link, job);
          }
        }),
        reduce((acc, cur) => {
          acc.push(cur);
          return acc;
        }, [])
      )
      .toPromise();
  }
}
