import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Series } from '../entity';

@Injectable()
export class SeriesRepo {
  constructor(
    @InjectRepository(Series)
    private repo: Repository<Series>
  ) {}

  async list(start: number, end: number) {
    const skip = start - 1;
    const take = Math.max(0, end - start) + 1;

    return await this.repo.findAndCount({
      skip,
      take
    });
  }
}
