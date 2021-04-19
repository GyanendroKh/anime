import { Resolver, Query, Args } from '@nestjs/graphql';
import { Episode } from '@app/database';
import { EpisodePaginatedData, PaginationQuery } from '../dto';
import { EpisodeService } from './episode.service';
import { EpisodeVideo } from '../dto/episode.dto';

@Resolver(() => Episode)
export class EpisodeResolver {
  constructor(private readonly service: EpisodeService) {}

  @Query(() => EpisodePaginatedData)
  async episodes(
    @Args('seriesId') seriesId: string,
    @Args('query', { nullable: true }) query: PaginationQuery
  ): Promise<EpisodePaginatedData> {
    const res = await this.service.list(seriesId, query);

    return res;
  }

  @Query(() => EpisodeVideo, { nullable: true })
  async episodeVideo(@Args('uuid') uuid: string) {
    return this.service.getVideo(uuid);
  }
}
