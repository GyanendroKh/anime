import { Queue } from 'bull';

export abstract class RunnerAbstract {
  constructor(protected readonly queue: Queue) {}

  pause() {
    return this.queue.pause();
  }

  resume() {
    return this.queue.resume();
  }

  clear() {
    return this.queue.obliterate({ force: true });
  }
}
