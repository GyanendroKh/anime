import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoGoAnimeSeries, Series, SeriesRepo } from '@app/database';
import { SeriesService } from './series.service';
import { SeriesResolver } from './series.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Series, GoGoAnimeSeries])],
  providers: [SeriesService, SeriesRepo, SeriesResolver]
})
export class SeriesModule {}
