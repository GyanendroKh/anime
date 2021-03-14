import { Injectable } from '@nestjs/common';

@Injectable()
export class SpiderService {
  getHello(): string {
    return 'Hello World!';
  }
}
