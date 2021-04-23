import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaginatedQuery } from '../types';
import { Series } from '../entity';

@Injectable()
export class SeriesRepo {
  constructor(
    @InjectRepository(Series)
    public repo: Repository<Series>
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
}
