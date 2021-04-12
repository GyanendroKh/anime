import { Injectable } from '@nestjs/common';
import { BehaviorSubject, EMPTY, of, Subscription } from 'rxjs';
import { concatMap, filter, map, mergeMap, tap } from 'rxjs/operators';
import { Runner } from '../runner';
import { GoGoAnimeDatabase } from './go-go-anime.database';
import {
  IAnimeEpisodeRet,
  IAnimeInfoRet,
  IEpisodeRunner,
  IEvent,
  IEventActions,
  IEventTypes,
  INameLinkIdRet,
  INameLinkRet
} from './go-go-anime.interface';
import { GoGoAnimeService } from './go-go-anime.service';

type INextDatabase =
  | {
      type: 'info';
      data: INameLinkRet & { data: IAnimeInfoRet };
    }
  | {
      type: 'episodes';
      data: IEpisodeRunner & IAnimeEpisodeRet<INameLinkIdRet>;
    };

@Injectable()
export class GoGoAnimeRunner {
  private readonly running$: BehaviorSubject<boolean>;

  private readonly events$: BehaviorSubject<IEvent<any>>;
  private readonly database$: BehaviorSubject<INextDatabase>;

  private readonly listRunner: Runner<number>;
  private readonly infoRunner: Runner<INameLinkRet>;
  private readonly episodeRunner: Runner<IEpisodeRunner>;

  private subscriptions$: Subscription[];

  private readonly workerCount = {
    info: 10,
    episode: 10
  };

  private readonly remaning = {
    info: 0,
    episode: 0
  };

  constructor(
    private readonly service: GoGoAnimeService,
    private readonly database: GoGoAnimeDatabase
  ) {
    this.running$ = new BehaviorSubject(null);

    this.events$ = new BehaviorSubject(null);
    this.database$ = new BehaviorSubject(null);

    this.listRunner = new Runner();
    this.infoRunner = new Runner();
    this.episodeRunner = new Runner();

    this.subscriptions$ = [];

    this.listRunner.onRunning(this.nextEvent('list', 'running'));
    this.infoRunner.onRunning(this.nextEvent('info', 'running'));
    this.episodeRunner.onRunning(this.nextEvent('episodes', 'running'));

    this.listRunner.state.onAdded((t, data) => {
      this.nextEvent('list', t === 'multiple' ? 'add-multiple' : 'add')(data);

      if (!this.listRunner.isRunning()) {
        this.listRunner.next();
      }
    });

    this.infoRunner.state.onAdded((t, data) => {
      this.nextEvent('info', t === 'multiple' ? 'add-multiple' : 'add')(data);

      if (t === 'single') {
        this.infoRunner.next();
        this.remaning.info++;
      } else {
        (data as INameLinkRet[]).forEach(() => {
          this.infoRunner.next();
          this.remaning.info++;
        });
      }
    });

    this.episodeRunner.state.onAdded((t, data) => {
      this.nextEvent(
        'episodes',
        t === 'multiple' ? 'add-multiple' : 'add'
      )(data);

      if (t === 'single') {
        this.episodeRunner.next();
        this.remaning.episode++;
      } else {
        (data as IEpisodeRunner[]).forEach(() => {
          this.episodeRunner.next();
          this.remaning.episode++;
        });
      }
    });

    this.running$.subscribe(d => {
      if (d) {
        this.subscriptions$ = Array.from(this.subscribe());
      } else {
        this.unsubscribe();

        this.events$.next(null);

        [this.listRunner, this.infoRunner, this.episodeRunner].forEach(s => {
          s.reset();
        });
      }

      this.nextEvent('runner', 'running')(d);
    });
  }

  getEvent() {
    const allowedActions: IEventActions[] = ['start', 'finish', 'running'];

    return this.events$.pipe(
      concatMap(d => (d === null ? EMPTY : of(d))),
      filter(d => allowedActions.includes(d.action))
    );
  }

  private subscribeDatabase$() {
    return this.database$
      .pipe(
        concatMap(d => (d === null ? EMPTY : of(d))),
        concatMap(async d => {
          if (d.type === 'info') {
            const series = await this.database.getSeries({
              link: d.data.link
            });

            if (!series) {
              await this.database.addSeries(d.data.data);
            }
          } else if (d.type === 'episodes') {
            await this.database.addEpisodes(d.data);
          }
        })
      )
      .subscribe();
  }

  isRunning() {
    return this.running$.value;
  }

  start() {
    if (!this.running$.value) {
      this.running$.next(true);
      this.listRunner.state.add(1);
    }
  }

  stop() {
    if (this.running$.value) {
      this.running$.next(false);
    }
  }

  private nextEvent(type: IEventTypes, action: IEventActions) {
    return (data: any, extra: any = null) => {
      this.events$.next({
        type,
        action,
        data,
        extra
      });
    };
  }

  private nextDatabase(data: INextDatabase) {
    this.database$.next(data);
  }

  private subscriberList() {
    return this.listRunner
      .get()
      .pipe(
        concatMap(async d => {
          this.nextEvent('list', 'start')(d);

          return {
            pageNo: d,
            data: await this.service.getAnimeList(d)
          };
        }),
        tap(d => this.nextEvent('list', 'finish')(d.pageNo))
      )
      .subscribe(d => {
        const current = this.listRunner.state.getData();
        const newPages = d.data.paginations.filter(
          i => i > d.data.pageNo && !current.includes(i)
        );

        this.listRunner.state.addMultiple(newPages);
        this.infoRunner.state.addMultiple(d.data.list);

        this.listRunner.next();
      });
  }

  private subscribeInfo() {
    return this.infoRunner
      .get()
      .pipe(
        mergeMap(async d => {
          this.nextEvent('info', 'start')(d.name, this.remaning.info);

          return {
            ...d,
            data: await this.service.getAnimeInfo(d.link)
          };
        }, this.workerCount.info),
        tap(d => {
          this.remaning.info--;
          this.nextEvent('info', 'finish')(d.name, this.remaning.info);
          this.nextDatabase({
            type: 'info',
            data: d
          });
        })
      )
      .subscribe(d => {
        this.episodeRunner.state.add({
          movieId: d.data.movieId,
          start: 0,
          end: d.data.episodeCount
        });
      });
  }

  private subscribeEpisode() {
    return this.episodeRunner
      .get()
      .pipe(
        mergeMap(async d => {
          this.nextEvent('episodes', 'start')(d.movieId, this.remaning.episode);

          return {
            ...d,
            data: await this.service.getAnimeEpisodes(d.movieId, d.start, d.end)
          };

          // return of(d).pipe(
          //   concatMap(e =>
          //     this.service.getAnimeEpisodes(e.movieId, e.start, e.end)
          //   ),
          //   concatMap(e => of(...e.episodes)),
          //   mergeMap(async e => {
          //     const url = new URL(e.link, this.service.baseUrl);
          //     const id = await this.service.getAnimeEpisodeId(url.toString());

          //     return {
          //       ...e,
          //       id: id
          //     };
          //   }, 25),
          //   reduce((acc, c) => {
          //     acc.push(c);
          //     return acc;
          //   }, [] as INameLinkIdRet[]),
          //   map<INameLinkIdRet[], IAnimeEpisodeRet<INameLinkIdRet>>(e => {
          //     return {
          //       episodes: e,
          //       movieId: d.movieId
          //     };
          //   })
          // );
        }, this.workerCount.episode),
        map(d => {
          return {
            ...d,
            data: d.data.episodes.map<INameLinkIdRet>(e => {
              return {
                ...e,
                id: null
              };
            })
          };
        }),
        tap(d => {
          this.remaning.episode--;
          this.nextEvent('episodes', 'finish')(
            d.movieId,
            this.remaning.episode
          );
          this.nextDatabase({
            type: 'episodes',
            data: {
              ...d,
              episodes: d.data
            }
          });
        })
      )
      .subscribe();
  }

  private *subscribe() {
    yield this.subscriberList();
    yield this.subscribeInfo();
    yield this.subscribeEpisode();
    yield this.subscribeDatabase$();
  }

  private unsubscribe() {
    this.subscriptions$.filter(s => {
      s.unsubscribe();

      return false;
    });
  }
}
