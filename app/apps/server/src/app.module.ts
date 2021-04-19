import { Module } from '@nestjs/common';
import { TYPEORM_MODULE } from '@app/database';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeriesModule } from './series/series.module';
import { GraphQLModule } from '@nestjs/graphql';
import { EpisodeModule } from './episode/episode.module';

@Module({
  imports: [
    TYPEORM_MODULE,
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      autoSchemaFile: true
    }),
    SeriesModule,
    EpisodeModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
