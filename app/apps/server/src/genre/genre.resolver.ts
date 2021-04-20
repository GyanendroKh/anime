import { Resolver } from '@nestjs/graphql';
import { Genre } from '@app/database';
import { Query } from '@nestjs/graphql';
import { GenreService } from './genre.service';

@Resolver(() => Genre)
export class GenreResolver {
  constructor(private readonly service: GenreService) {}

  @Query(() => [Genre])
  genreGetAll() {
    return this.service.getAll();
  }
}
