import { Injectable } from '@nestjs/common';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { Queue } from '../../../../libs/data/src';
import { IEvent, INameLinkRet } from './go-go-anime.interface';
import { GoGoAnimeService } from './go-go-anime.service';
import { GoGoAnimeState } from './go-go-anime.state';

@Injectable()
export class GoGoAnimeRunner {
  private readonly events$: BehaviorSubject<IEvent<any>>;

  private readonly animeList$: BehaviorSubject<number>;
  private readonly animeInfo$: BehaviorSubject<INameLinkRet>;
  private readonly animeEpisodes$: BehaviorSubject<{
    movieId: string;
    start: string;
    end: string;
  }>;

  private readonly animeList$isRunning: BehaviorSubject<boolean>;
  private readonly animeInfo$isRunning: BehaviorSubject<boolean>;
  private readonly animeEpisodes$isRunning: BehaviorSubject<boolean>;

  constructor(
    private readonly state: GoGoAnimeState,
    private readonly service: GoGoAnimeService
  ) {
    this.events$ = new BehaviorSubject(null);

    this.animeList$ = new BehaviorSubject(0);
    this.animeInfo$ = new BehaviorSubject(null);
    this.animeEpisodes$ = new BehaviorSubject(null);

    this.animeList$isRunning = new BehaviorSubject(false);
    this.animeInfo$isRunning = new BehaviorSubject(false);
    this.animeEpisodes$isRunning = new BehaviorSubject(false);

    this.state.getAnimeList().onAdded((t, data) => {
      this.events$.next({
        type: 'list',
        action: t === 'multiple' ? 'add-multiple' : 'add',
        data
      });

      if (!this.animeList$isRunning.value) {
        this.start('list');
      }
    });

    this.state.getAnimeInfo().onAdded((t, data) => {
      this.events$.next({
        type: 'info',
        action: t === 'multiple' ? 'add-multiple' : 'add',
        data
      });

      if (!this.animeInfo$isRunning.value) {
        this.start('info');
      }
    });

    this.state.getAnimeEpisodes().onAdded((t, data) => {
      this.events$.next({
        type: 'episodes',
        action: t === 'multiple' ? 'add-multiple' : 'add',
        data
      });

      if (!this.animeEpisodes$isRunning.value) {
        this.start('episodes');
      }
    });
  }

  getEvent(): Observable<IEvent<any>> {
    return this.events$.pipe(concatMap(d => (d === null ? EMPTY : of(d))));
  }

  subscribeAnimeList() {
    return this.animeList$
      .pipe(
        concatMap(d => (d === 0 ? EMPTY : of(d))),
        tap(d => {
          this.events$.next({
            type: 'list',
            action: 'start',
            data: d
          });
        }),
        concatMap(d => this.service.getAnimeList(d))
      )
      .subscribe(d => {
        const current = this.state.getAnimeList().getData();
        const newPages = d.paginations.filter(
          i => i > d.pageNo && !current.includes(i)
        );

        this.state.getAnimeList().addMultiple(newPages);
        this.state.getAnimeInfo().addMultiple(d.list);

        this.events$.next({
          type: 'list',
          action: 'finish',
          data: d
        });

        this.start('list');
      });
  }

  subscribeAnimeInfo() {
    return this.animeInfo$
      .pipe(
        concatMap(d => (d === null ? EMPTY : of(d))),
        tap(d => {
          this.events$.next({
            type: 'info',
            action: 'start',
            data: d
          });
        }),
        concatMap(d => this.service.getAnimeInfo(d.link))
      )
      .subscribe(d => {
        this.state
          .getAnimeEpisodes()
          .add({ movieId: d.movieId, start: '0', end: d.episodeCount + '' });

        this.events$.next({
          type: 'info',
          action: 'finish',
          data: d
        });

        this.start('info');
      });
  }

  subscribeAnimeEpisodes() {
    return this.animeEpisodes$
      .pipe(
        concatMap(d => (d === null ? EMPTY : of(d))),
        tap(d => {
          this.events$.next({
            type: 'episodes',
            action: 'start',
            data: d
          });
        }),
        concatMap(d => this.service.loadAnimeEpidoes(d.movieId, d.start, d.end))
      )
      .subscribe(d => {
        this.events$.next({
          type: 'episodes',
          action: 'finish',
          data: d
        });

        this.start('episodes');
      });
  }

  subscribe() {
    this.subscribeAnimeList();
    this.subscribeAnimeInfo();
    this.subscribeAnimeEpisodes();

    this.animeList$isRunning.subscribe(d => {
      this.events$.next({
        type: 'list',
        action: 'running',
        data: d
      });
    });
    this.animeInfo$isRunning.subscribe(d => {
      this.events$.next({
        type: 'info',
        action: 'running',
        data: d
      });
    });
    this.animeEpisodes$isRunning.subscribe(d => {
      this.events$.next({
        type: 'episodes',
        action: 'running',
        data: d
      });
    });
  }

  start(type: 'list' | 'info' | 'episodes'): boolean {
    const objs: {
      [K in typeof type]: [
        Queue<any>,
        BehaviorSubject<any>,
        BehaviorSubject<boolean>
      ];
    } = {
      list: [
        this.state.getAnimeList(),
        this.animeList$,
        this.animeList$isRunning
      ],
      info: [
        this.state.getAnimeInfo(),
        this.animeInfo$,
        this.animeInfo$isRunning
      ],
      episodes: [
        this.state.getAnimeEpisodes(),
        this.animeEpisodes$,
        this.animeEpisodes$isRunning
      ]
    };

    const next = objs[type][0].get();

    if (next) {
      if (!objs[type][2].value) {
        objs[type][2].next(true);
      }
      objs[type][1].next(next);
    } else {
      objs[type][2].next(false);
    }

    return !!next;
  }
}
