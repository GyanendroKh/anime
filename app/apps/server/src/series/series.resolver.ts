import { Resolver, Query, Args } from '@nestjs/graphql';
import { Series } from '@app/database';
import { SeriesService } from './series.service';
import { PaginationQuery, SeriesPaginatedData } from '../dto';
import { PaginationDefaultPipe } from '../pagination.pipe';

@Resolver(() => Series)
export class SeriesResolver {
  constructor(private readonly service: SeriesService) {}

  @Query(() => SeriesPaginatedData)
  async seriesList(
    @Args('query', { nullable: true }, PaginationDefaultPipe)
    query: PaginationQuery
  ): Promise<SeriesPaginatedData> {
    const res = await this.service.list(query);

    return res;
  }

  @Query(() => Series, { nullable: true })
  async series(@Args('uuid') uuid: string): Promise<Series> {
    return this.service.repo.get(uuid);
  }

  @Query(() => SeriesPaginatedData)
  async seriesSearch(
    @Args('query') query: string,
    @Args('option', { nullable: true }, PaginationDefaultPipe)
    option?: PaginationQuery
  ): Promise<SeriesPaginatedData> {
    return this.service.search(query, option);
  }
}
