import { Controller, Get } from '@nestjs/common';
import { SpiderService } from './spider.service';

@Controller()
export class SpiderController {
  constructor(private readonly spiderService: SpiderService) {}

  @Get()
  getHello(): string {
    return this.spiderService.getHello();
  }
}
