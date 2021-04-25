import { Queue } from 'bull';

export abstract class RunnerAbstract {
  constructor(protected readonly queue: Queue) {}

  pause() {
    return this.queue.pause();
  }

  clear() {
    return this.queue.obliterate({ force: true });
  }
}
