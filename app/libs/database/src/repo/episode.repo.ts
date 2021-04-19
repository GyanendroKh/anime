import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaginatedQuery } from '../../../../apps/server/src/types';
import { Episode, GoGoAnimeEpisode } from '../entity';

@Injectable()
export class EpisodeRepo {
  constructor(
    @InjectRepository(Episode)
    private readonly repo: Repository<Episode>,
    @InjectRepository(GoGoAnimeEpisode)
    private readonly videoRepo: Repository<GoGoAnimeEpisode>
  ) {}

  async list(seriesId: string, { start, end }: IPaginatedQuery) {
    const skip = start - 1;
    const take = Math.max(0, end - start) + 1;

    const result = await this.repo
      .createQueryBuilder('e')
      .select()
      .leftJoin('e.series', 's')
      .where('s.uuid = :seriesId')
      .setParameter('seriesId', seriesId)
      .skip(skip)
      .take(take)
      .orderBy('e.number')
      .getManyAndCount();

    return result;
  }

  async getVideo(uuid: string) {
    return await this.videoRepo
      .createQueryBuilder('g')
      .leftJoin('g.episode', 'e')
      .where('e.uuid = :uuid')
      .setParameter('uuid', uuid)
      .getOne();
  }
}