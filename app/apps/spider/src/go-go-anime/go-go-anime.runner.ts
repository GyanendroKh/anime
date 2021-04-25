import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class GoGoAnimeRunner {
  constructor(
    @InjectQueue('gogoanime')
    private readonly queue: Queue
  ) {}

  addList(pageNo: number) {
    this.queue.add('list', pageNo);
    this.queue.add('list-run', pageNo + 1);
  }

  addInfo(link: string) {
    this.queue.add('info', link);
  }

  addEpisodes(link: string, count: number) {
    this.queue.add('episodes', { link, count });
  }
}
