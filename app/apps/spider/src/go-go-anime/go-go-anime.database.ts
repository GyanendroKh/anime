import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Episode,
  Genre,
  GoGoAnimeEpisode,
  GoGoAnimeSeries,
  Series
} from '@app/database';
import { INameLinkRet } from '@app/scrapper';
import { In, Repository } from 'typeorm';

@Injectable()
export class GoGoAnimeDatabase {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>,
    @InjectRepository(Series)
    private readonly seriesRepo: Repository<Series>,
    @InjectRepository(GoGoAnimeSeries)
    private readonly gogoAnimeSeriesRepo: Repository<GoGoAnimeSeries>,
    @InjectRepository(Episode)
    private readonly episodeRepo: Repository<Episode>,
    @InjectRepository(GoGoAnimeEpisode)
    private readonly gogoAnimeEpisodeRepo: Repository<GoGoAnimeEpisode>
  ) {}

  getGenres(genres: string[]) {
    return this.genreRepo.find({
      where: {
        name: In(genres)
      }
    });
  }

  async addGenres(genres: string[]) {
    const exist = await this.getGenres(genres);
    const existGenre = exist.map(g => g.name);
    const genresToAdd = genres.filter(g => !existGenre.includes(g));

    const addedGenres = new Array<Genre>();

    for (const g of genresToAdd) {
      addedGenres.push(
        await this.genreRepo
          .create({
            name: g
          })
          .save()
      );
    }

    return [...exist, ...addedGenres];
  }

  async getSeries(
    where: ['link' | 'movieId', string],
    others?: {
      status?: string;
    }
  ) {
    const gogoAnimeQuery = this.gogoAnimeSeriesRepo
      .createQueryBuilder('s')
      .select('s.series')
      .where(`s.${where[0]} = :p`);

    const query = this.seriesRepo.createQueryBuilder('s');

    query.where(`s.id = (${gogoAnimeQuery.getQuery()})`);

    if (others) {
      if (others.status) {
        query
          .andWhere('s.status = :status')
          .setParameter('status', others.status);
      }
    }

    query.setParameter('p', where[1]);

    return await query.getOne();
  }

  getEpisodes(links: string[]) {
    return this.gogoAnimeEpisodeRepo.find({
      where: {
        link: In(links)
      }
    });
  }

  async addEpisodes(movieId: string, data: INameLinkRet[]) {
    const links = data.map(d => d.link);
    const exist = await this.getEpisodes(links);
    const existEpisodes = exist.map(e => e.link);
    const episodesToAdd = data.filter(l => !existEpisodes.includes(l.link));

    if (episodesToAdd.length === 0) {
      return exist;
    }

    const series = await this.getSeries(['movieId', movieId]);

    const episodesAdded = new Array<GoGoAnimeEpisode>();

    for (const g of episodesToAdd) {
      const episode = this.episodeRepo.create({
        title: g.name,
        number: Number(g.name.toLowerCase().replace('ep', '').trim()),
        series
      });

      const gogoAnimeEpisode = this.gogoAnimeEpisodeRepo.create({
        link: g.link,
        episode
      });

      episodesAdded.push(await gogoAnimeEpisode.save());
    }

    return [...exist, ...episodesAdded];
  }
}
