import { Field, ObjectType } from '@nestjs/graphql';
import { GoGoAnimeEpisode } from '@app/database';
import { IAnimeVideoLink } from '../types';

@ObjectType()
export class AnimeVideoLink implements IAnimeVideoLink {
  @Field()
  name: string;

  @Field()
  link: string;
}

@ObjectType()
export class EpisodeVideo {
  @Field(() => GoGoAnimeEpisode)
  episode: GoGoAnimeEpisode;

  @Field(() => [AnimeVideoLink])
  links: AnimeVideoLink[];
}
