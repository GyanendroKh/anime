import { Field, Int, ObjectType, InputType } from '@nestjs/graphql';
import { Series } from '@app/database';
import { IPaginatedData, IPaginatedQuery } from '../types';

@InputType()
export class PaginationQuery implements IPaginatedQuery {
  @Field(() => Int)
  start: number;

  @Field(() => Int)
  end: number;
}

@ObjectType()
export class SeriesPaginatedData implements IPaginatedData<Series> {
  @Field(() => Int)
  start: number;

  @Field(() => Int)
  end: number;

  @Field(() => Int)
  count: number;

  @Field(() => [Series])
  data: Series[];
}
