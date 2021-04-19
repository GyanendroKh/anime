import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre, GoGoAnimeSeries, Series } from '@app/database/entity';
import { GoGoAnimeController } from './go-go-anime.controller';
import { GoGoAnimeDatabase } from './go-go-anime.database';
import { GoGoAnimeGateWay } from './go-go-anime.gateway';
import { GoGoAnimeRunner } from './go-go-anime.runner';
import { GoGoAnimeService } from './go-go-anime.service';
import { GoGoAnimeState } from './go-go-anime.state';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Series, Genre, GoGoAnimeSeries])
  ],
  controllers: [GoGoAnimeController],
  providers: [
    GoGoAnimeService,
    GoGoAnimeRunner,
    GoGoAnimeState,
    GoGoAnimeGateWay,
    GoGoAnimeDatabase
  ],
  exports: [GoGoAnimeService]
})
export class GoGoAnimeModule {}
