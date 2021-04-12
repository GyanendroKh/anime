import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import {
  Episode,
  Genre,
  GoGoAnimeEpisode,
  GoGoAnimeSeries,
  Series
} from '@app/database/entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IAnimeEpisodeRet,
  IAnimeInfoRet,
  INameLinkIdRet
} from './go-go-anime.interface';
import { of } from 'rxjs';
import { concatMap, map, reduce } from 'rxjs/operators';

@Injectable()
export class GoGoAnimeDatabase {
  constructor(
    @InjectRepository(GoGoAnimeSeries)
    private readonly gogoAnimeSeries: Repository<GoGoAnimeSeries>,
    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>
  ) {}

  async getSeries(
    option: FindOneOptions<GoGoAnimeSeries>['where'],
    withRelation = false
  ) {
    return this.gogoAnimeSeries.findOne({
      where: option,
      relations: withRelation ? ['series'] : []
    });
  }

  async addSeries(info: IAnimeInfoRet) {
    const genres = await of(...info.genres)
      .pipe(
        concatMap(async g => {
          let genre = await this.getGenre(g);

          if (!genre) {
            genre = Genre.create({
              name: g
            });
          }

          return genre;
        }),
        reduce<Genre, Genre[]>((acc, c) => [...acc, c], [])
      )
      .toPromise();

    const series = Series.create({
      title: info.title,
      type: info.type,
      thumbnail: info.image,
      summary: info.summary,
      released: info.released,
      status: info.status,
      genres: genres,
      episodes: []
    });

    const gogoAnimeSeries = GoGoAnimeSeries.create({
      movieId: info.movieId,
      link: info.link,
      series: series
    });

    await gogoAnimeSeries.save();

    return gogoAnimeSeries;
  }

  async getGenre(genre: string) {
    return await this.genreRepo.findOne({
      where: {
        name: genre
      }
    });
  }

  async addEpisodes(info: IAnimeEpisodeRet<INameLinkIdRet>) {
    const gogoAnimeSeries = await this.getSeries(
      { movieId: info.movieId },
      true
    );

    const episodes = await of(...info.episodes)
      .pipe(
        map(e => {
          const episode = Episode.create({
            title: e.name,
            number: Number(e.name.replace('EP', '').trim()) ?? 0,
            series: gogoAnimeSeries.series
          });

          const gogoAnimeEpisode = GoGoAnimeEpisode.create({
            episode: episode,
            link: e.link,
            videoId: null
          });

          return gogoAnimeEpisode;
        }),
        concatMap(e => e.save()),
        reduce<GoGoAnimeEpisode, GoGoAnimeEpisode[]>((acc, c) => {
          acc.push(c);

          return acc;
        }, [])
      )
      .toPromise();

    return [episodes, gogoAnimeSeries] as const;
  }
}
