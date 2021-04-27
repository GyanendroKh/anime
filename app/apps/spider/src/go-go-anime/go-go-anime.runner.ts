import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { EventEmitter2 } from 'eventemitter2';
import { RunnerAbstract } from '../runner.abstract';

@Injectable()
export class GoGoAnimeRunner extends RunnerAbstract {
  constructor(
    @InjectQueue('gogoanime')
    queue: Queue,
    private readonly eventEmitter: EventEmitter2
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

  skipInfoRun(link: string) {
    this.eventEmitter.emit('gogoanime.info-run.skip', link);
  }

  addInfoRun(link: string) {
    this.queue.add('info-run', link);
  }

  addEpisodes(movieId: string, count: number) {
    this.queue.add('episodes', { movieId, count });
  }

  skipEpisodesRun(movieId: string) {
    this.eventEmitter.emit('gogoanime.episodes-run.skip', movieId);
  }

  addEpisodesRun(movieId: string, count: number) {
    this.queue.add('episodes-run', { movieId, count });
  }
}
