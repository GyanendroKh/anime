import { Injectable } from '@nestjs/common';
import { Series, SeriesRepo } from '@app/database';
import { RedisService } from 'nestjs-redis';
import { IPaginatedData, IPaginatedQuery } from '../types';
import { In, Raw } from 'typeorm';
import { DEFAULT_PAGINATION } from '../dto';
import IORedis from 'ioredis';

@Injectable()
export class SeriesService {
  private readonly redisClient: IORedis.Redis;
  constructor(
    public readonly repo: SeriesRepo,
    private readonly redis: RedisService
  ) {
    this.redisClient = redis.getClient();
  }

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
      .skip(offset)
      .getManyAndCount();

    return {
      limit,
      offset,
      count,
      data
    };
  }

  async getTopAnimes(query: IPaginatedQuery): Promise<IPaginatedData<Series>> {
    const key = ['anime', 'list', 'top'].join(':');
    const length = await this.redisClient.llen(key);

    const res = (
      await this.redis
        .getClient()
        .lrange(key, query.offset, query.offset + query.limit)
    ).filter(d => d.trim() !== '');

    const data = await (() => {
      if (res.length === 0) {
        return Promise.resolve<Series[]>([]);
      }

      return this.repo.repo.find({
        where: {
          uuid: In(res)
        },
        relations: ['genres', 'episodes']
      });
    })();

    return {
      ...query,
      count: length,
      data: data
    };
  }
}
