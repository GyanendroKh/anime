import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { RunnerAbstract } from '../runner.abstract';

@Injectable()
export class GoGoAnimeRunner extends RunnerAbstract {
  constructor(
    @InjectQueue('gogoanime')
    queue: Queue
  ) {
    super(queue);
  }

  startRun() {
    this.startGenreRun();
  }

  startGenreRun() {
    this.queue.add('genre-run');
  }

  addList(pageNo: number) {
    this.queue.add('list', pageNo);
  }

  addListRun(pageNo: number) {
    this.queue.add('list-run', pageNo);
  }

  addInfo(link: string) {
    this.queue.add('info', link);
  }

  addInfoRun(link: string) {
    this.queue.add('info-run', link);
  }

  addEpisodes(link: string, count: number) {
    this.queue.add('episodes', { link, count });
  }

  addEpisodesRun(link: string, count: number) {
    this.queue.add('episodes-run', { link, count });
  }
}
