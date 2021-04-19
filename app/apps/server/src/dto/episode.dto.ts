import { Field, ObjectType } from '@nestjs/graphql';
import { GoGoAnimeEpisode } from '../../../../libs/database/src';
import { IAnimeVideLink } from '../../../spider/src/go-go-anime/go-go-anime.interface';

@ObjectType()
export class AnimeVideoLink implements IAnimeVideLink {
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
