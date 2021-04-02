import { Module } from '@nestjs/common';
import { SpiderController } from './spider.controller';
import { SpiderService } from './spider.service';
import { GoGoAnimeModule } from './go-go-anime/go-go-anime.module';

@Module({
  imports: [GoGoAnimeModule],
  controllers: [SpiderController],
  providers: [SpiderService]
})
export class SpiderModule {}
