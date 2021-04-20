import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Episode, Series } from '@app/database';
import { IPaginatedData, IPaginatedQuery } from '../types';

export const DEFAULT_PAGINATION: IPaginatedQuery = {
  offset: 0,
  limit: 20
};

@InputType()
export class PaginationQuery implements IPaginatedQuery {
  @Field(() => Int, { nullable: true })
  offset: number;

  @Field(() => Int, { nullable: true })
  limit: number;
}

@ObjectType()
class PaginationQueryObject implements IPaginatedQuery {
  @Field(() => Int)
  offset: number;

  @Field(() => Int)
  limit: number;
}

@ObjectType()
export class SeriesPaginatedData
  extends PaginationQueryObject
  implements IPaginatedData<Series> {
  @Field(() => Int)
  count: number;

  @Field(() => [Series])
  data: Series[];
}

@ObjectType()
export class EpisodePaginatedData
  extends PaginationQueryObject
  implements IPaginatedData<Episode> {
  @Field(() => Int)
  count: number;

  @Field(() => [Episode])
  data: Episode[];
}
