import { Injectable } from '@nestjs/common';
import { Episode, EpisodeRepo } from '@app/database';
import { IPaginatedData, IPaginatedQuery } from '../types';
import { GoGoAnimeService } from '../../../spider/src/go-go-anime/go-go-anime.service';

@Injectable()
export class EpisodeService {
  constructor(
    public readonly repo: EpisodeRepo,
    private readonly spiderService: GoGoAnimeService
  ) {}

  async list(
    seriesUuid: string,
    query: IPaginatedQuery = {
      start: 1,
      end: 20
    }
  ): Promise<IPaginatedData<Episode>> {
    const start = Math.max(query.start, 1);
    const end = Math.max(query.end, 1);

    const [episodes, count] = await this.repo.list(seriesUuid, query);

    return {
      start,
      end,
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
      const videoId = await this.spiderService.getAnimeEpisodeId(
        `${this.spiderService.baseUrl}${video.link}`
      );
      video.videoId = videoId;
      video.save();
    }

    const links = await this.spiderService.getAnimeVideoLinks(video.videoId);

    return {
      episode: video,
      links
    };
  }
}