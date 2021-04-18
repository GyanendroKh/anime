import { Resolver, Query, Args } from '@nestjs/graphql';
import { Series } from '@app/database';
import { SeriesService } from './series.service';

@Resolver(() => Series)
export class SeriesResolver {
  constructor(private readonly service: SeriesService) {}

  @Query(() => [Series])
  async seriesList(): Promise<Series[]> {
    const res = await this.service.list();

    return res.data;
  }

  @Query(() => Series)
  async series(@Args('uuid') uuid: string): Promise<Series> {
    return this.service.repo.get(uuid);
  }
}
