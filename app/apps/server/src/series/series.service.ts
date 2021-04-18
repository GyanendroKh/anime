import { Injectable } from '@nestjs/common';
import { Series, SeriesRepo } from '@app/database';
import { IPaginatedData, IPaginatedQuery } from '../types';

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
}
