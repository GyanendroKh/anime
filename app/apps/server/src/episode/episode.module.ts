import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode, EpisodeRepo, GoGoAnimeEpisode } from '@app/database';
import { EpisodeService } from './episode.service';
import { EpisodeResolver } from './episode.resolver';
import { CacheMod } from '../cache';

@Module({
  imports: [TypeOrmModule.forFeature([Episode, GoGoAnimeEpisode]), CacheMod],
  providers: [EpisodeService, EpisodeRepo, EpisodeResolver]
})
export class EpisodeModule {}
