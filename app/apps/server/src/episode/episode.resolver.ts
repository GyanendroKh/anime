import { Resolver, Query, Args } from '@nestjs/graphql';
import { Episode } from '@app/database';
import { EpisodeService } from './episode.service';
import { EpisodePaginatedData, PaginationQuery, EpisodeVideo } from '../dto';
import { PaginationDefaultPipe } from '../pipe';

@Resolver(() => Episode)
export class EpisodeResolver {
  constructor(private readonly service: EpisodeService) {}

  @Query(() => EpisodePaginatedData)
  async episodes(
    @Args('seriesId') seriesId: string,
    @Args('query', { nullable: true }, PaginationDefaultPipe)
    query: PaginationQuery
  ): Promise<EpisodePaginatedData> {
    const res = await this.service.list(seriesId, query);

    return res;
  }

  @Query(() => EpisodeVideo, { nullable: true })
  async episodeVideo(@Args('uuid') uuid: string) {
    return this.service.getVideo(uuid);
  }
}
