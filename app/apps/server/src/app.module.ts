import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TYPEORM_MODULE } from '@app/database';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeriesModule } from './series/series.module';
import { EpisodeModule } from './episode/episode.module';
import { GenreModule } from './genre/genre.module';

@Module({
  imports: [
    TYPEORM_MODULE,
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      autoSchemaFile: true
    }),
    SeriesModule,
    EpisodeModule,
    GenreModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
