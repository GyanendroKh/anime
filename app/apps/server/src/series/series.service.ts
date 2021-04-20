import { Injectable } from '@nestjs/common';
import { Series, SeriesRepo } from '@app/database';
import { IPaginatedData, IPaginatedQuery } from '../types';
import { Raw } from 'typeorm';

@Injectable()
export class SeriesService {
  constructor(public readonly repo: SeriesRepo) {}

  async list(
    data: IPaginatedQuery = {
      start: 1,
      end: 20
    }
  ): Promise<IPaginatedData<Series>> {
    const start = Math.max(data.start, 1);
    const end = Math.max(data.end, 1);

    const [series, count] = await this.repo.list(start, end);

    return {
      start,
      end,
      data: series,
      count
    };
  }

  async search(
    query: string,
    option: IPaginatedQuery = {
      start: 1,
      end: 20
    }
  ): Promise<IPaginatedData<Series>> {
    const start = Math.max(option.start, 1);
    const end = Math.max(option.end, 1);

    const skip = start - 1;
    const take = Math.max(0, end - start) + 1;

    const [series, count] = await Series.findAndCount({
      where: {
        title: Raw(a => `${a} LIKE :query`, { query: `%${query}%` })
      },
      take,
      skip,
      relations: ['genres', 'episodes']
    });

    return {
      start,
      end,
      data: series,
      count
    };
  }
}
