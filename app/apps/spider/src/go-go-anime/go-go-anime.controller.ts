import { Controller } from '@nestjs/common';
import { GoGoAnimeService } from './go-go-anime.service';

@Controller('gogoanime')
export class GoGoAnimeController {
  constructor(private readonly service: GoGoAnimeService) {}
}
