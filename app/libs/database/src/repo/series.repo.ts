import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaginatedQuery } from '../types';
import { GoGoAnimeSeries, Series } from '../entity';

@Injectable()
export class SeriesRepo {
  constructor(
    @InjectRepository(Series)
    public repo: Repository<Series>,
    @InjectRepository(GoGoAnimeSeries)
    public gogoAnimeRepo: Repository<GoGoAnimeSeries>
  ) {}

  async list({ offset, limit }: IPaginatedQuery) {
    return await this.repo.findAndCount({
      skip: offset,
      take: limit,
      relations: ['genres', 'episodes']
    });
  }

  async get(uuid: string): Promise<Series | undefined> {
    return this.repo.findOne(
      {
        uuid
      },
      {
        relations: ['genres', 'episodes']
      }
    );
  }

  async getSeriesByLink(links: Array<string>) {
    const gogoAnimeQuery = this.gogoAnimeRepo
      .createQueryBuilder('gs')
      .select('gs.series')
      .where('gs.link IN (:...links)');

    const res = await this.repo
      .createQueryBuilder('s')
      .where(`s.id IN (${gogoAnimeQuery.getQuery()})`)
      .setParameter('links', links)
      .getMany();

    return res;
  }
}
