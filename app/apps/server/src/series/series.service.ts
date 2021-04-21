import { Injectable } from '@nestjs/common';
import { Series, SeriesRepo } from '@app/database';
import { IPaginatedData, IPaginatedQuery } from '../types';
import { Raw } from 'typeorm';
import { DEFAULT_PAGINATION } from '../dto';

@Injectable()
export class SeriesService {
  constructor(public readonly repo: SeriesRepo) {}

  async list(
    query: IPaginatedQuery = DEFAULT_PAGINATION
  ): Promise<IPaginatedData<Series>> {
    const [series, count] = await this.repo.list(query);

    return {
      ...query,
      data: series,
      count
    };
  }

  async search(
    query: string,
    { limit, offset }: IPaginatedQuery = DEFAULT_PAGINATION
  ): Promise<IPaginatedData<Series>> {
    const [series, count] = await Series.findAndCount({
      where: {
        title: Raw(a => `${a} LIKE :query`, { query: `%${query}%` })
      },
      take: limit,
      skip: offset,
      relations: ['genres', 'episodes']
    });

    return {
      limit,
      offset,
      data: series,
      count
    };
  }

  async listByGenre(
    genre: string,
    { limit, offset }: IPaginatedQuery = DEFAULT_PAGINATION
  ): Promise<IPaginatedData<Series>> {
    const [data, count] = await this.repo.repo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.genres', 'g')
      .leftJoinAndSelect('s.episodes', 'e')
      .where('g.uuid = :uuid')
      .setParameter('uuid', genre)
      .take(limit)
      .offset(offset)
      .getManyAndCount();

    return {
      limit,
      offset,
      count,
      data
    };
  }
}
