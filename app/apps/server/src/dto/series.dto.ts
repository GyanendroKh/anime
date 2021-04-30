import { Field, ObjectType } from '@nestjs/graphql';
import { Series } from '@app/database';

@ObjectType()
export class SeriesAnimeShowcase {
  @Field(() => [Series])
  popular: Series[];

  @Field(() => [Series])
  onGoingPopular: Series[];

  @Field(() => [Series])
  recentlyAdded: Series[];
}
