import { Resolver, Query, Args } from '@nestjs/graphql';
import { Series } from '@app/database';
import { SeriesService } from './series.service';
import { PaginationQuery, SeriesPaginatedData } from '../dto';

@Resolver(() => Series)
export class SeriesResolver {
  constructor(private readonly service: SeriesService) {}

  @Query(() => SeriesPaginatedData)
  async seriesList(
    @Args('query', { nullable: true }) query: PaginationQuery
  ): Promise<SeriesPaginatedData> {
    const res = await this.service.list(query);

    return res;
  }

  @Query(() => Series)
  async series(@Args('uuid') uuid: string): Promise<Series> {
    return this.service.repo.get(uuid);
  }
}
