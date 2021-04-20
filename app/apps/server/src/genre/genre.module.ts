import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from '@app/database';
import { GenreService } from './genre.service';
import { GenreResolver } from './genre.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Genre])],
  providers: [GenreService, GenreResolver]
})
export class GenreModule {}
