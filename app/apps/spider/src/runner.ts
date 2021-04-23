import { Queue } from '@anime/data';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

export type IRunningCallback = (running: boolean) => void;

export class Runner<T> {
  private readonly isRunning$: BehaviorSubject<boolean>;
  private readonly worker$: BehaviorSubject<T>;

  public readonly state: Queue<T>;

  private onRunningCallback: IRunningCallback;

  constructor() {
    this.isRunning$ = new BehaviorSubject(null);
    this.worker$ = new BehaviorSubject(null);

    this.state = new Queue();

    this.getIsRunning().subscribe(d => {
      if (this.onRunningCallback) {
        this.onRunningCallback(d);
      }
    });
  }

  onRunning(callback: IRunningCallback) {
    this.onRunningCallback = callback;
  }

  getIsRunning(): Observable<boolean> {
    return this.isRunning$.pipe(concatMap(d => (d === null ? EMPTY : of(d))));
  }

  isRunning(): boolean {
    return this.isRunning$.value;
  }

  get(): Observable<T> {
    return this.worker$.pipe(concatMap(d => (d === null ? EMPTY : of(d))));
  }

  next(): T | null {
    const next = this.state.get();

    if (next) {
      if (!this.isRunning()) {
        this.isRunning$.next(true);
      }

      this.worker$.next(next);
    } else {
      if (this.isRunning()) {
        this.isRunning$.next(false);
      }
    }

    return next;
  }

  reset() {
    this.state.clear();
    this.isRunning$.next(false);
    this.worker$.next(null);
    this.isRunning$.next(null);
  }
}
