import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Episode, EpisodeRepo } from '@app/database';
import { GoGoAnimeScrapper } from '@app/scrapper';
import { Cache } from 'cache-manager';
import { IPaginatedData, IPaginatedQuery } from '../types';
import { DEFAULT_PAGINATION } from '../dto';

@Injectable()
export class EpisodeService {
  constructor(
    public readonly repo: EpisodeRepo,
    private readonly scrapper: GoGoAnimeScrapper,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async list(
    seriesUuid: string,
    query: IPaginatedQuery = DEFAULT_PAGINATION
  ): Promise<IPaginatedData<Episode>> {
    const [episodes, count] = await this.repo.list(seriesUuid, query);

    return {
      ...query,
      count,
      data: episodes
    };
  }

  async getVideo(uuid: string) {
    const video = await this.repo.getVideo(uuid);

    if (!video) {
      return null;
    }

    if (!video.videoId) {
      const videoId = await this.scrapper.getAnimeEpisodeId(video.link);
      video.videoId = videoId;
      video.save();
    }

    const cacheKey = ['episode', 'video', 'link', video.videoId].join(':');
    const cacheValue = await this.cacheManager.get<string>(cacheKey);

    const links = await (async () => {
      if (cacheValue) {
        return JSON.parse(cacheValue);
      }

      const res = await this.scrapper.getAnimeVideoLinks(video.videoId);

      await this.cacheManager.set(cacheKey, JSON.stringify(res), {
        ttl: 1800
      });

      return res;
    })();

    return {
      episode: video,
      links
    };
  }
}
