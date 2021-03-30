import { Injectable } from '@nestjs/common';
import { BehaviorSubject, EMPTY, of, Subscription } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { INameLinkRet } from './go-go-anime.interface';
import { GoGoAnimeService } from './go-go-anime.service';
import { GoGoAnimeState } from './go-go-anime.state';

@Injectable()
export class GoGoAnimeRunner {
  private readonly animeList$: BehaviorSubject<number>;
  private readonly animeInfo$: BehaviorSubject<INameLinkRet>;
  private readonly animeEpisodes$: BehaviorSubject<{
    movieId: string;
    start: string;
    end: string;
  }>;

  private animeListSubscription$: Subscription;
  private animeInfoSubscription$: Subscription;
  private animeEpisodesSubscription$: Subscription;

  constructor(
    private readonly state: GoGoAnimeState,
    private readonly service: GoGoAnimeService
  ) {
    this.animeList$ = new BehaviorSubject(0);
    this.animeInfo$ = new BehaviorSubject(null);
    this.animeEpisodes$ = new BehaviorSubject(null);
  }

  subscribeAnimeList() {
    return this.animeList$
      .pipe(
        concatMap(d => (d === 0 ? EMPTY : of(d))),
        tap(d => console.log('Start... Anime List:', d)),
        concatMap(d => this.service.getAnimeList(d)),
        tap(d => console.log('End  ... Anime List:', d.pageNo, '\n'))
      )
      .subscribe(
        d => {
          d.list.forEach(i => {
            this.state.getAnimeInfo().add(i);
          });

          if (d.paginations.includes(d.pageNo + 1)) {
            this.animeList$.next(d.pageNo + 1);
          } else {
            console.log('Finish Anime List.');
          }
        },
        err => console.log(err)
      );
  }

  subscribeAnimeInfo() {
    return this.animeInfo$
      .pipe(
        concatMap(d => (d === null ? EMPTY : of(d))),
        tap(d => console.log('Start... Anime Info:', d.name)),
        concatMap(d => this.service.getAnimeInfo(d.link)),
        tap(d => console.log('End  ... Anime Info:', d.title, '\n'))
      )
      .subscribe(
        d => {
          this.state
            .getAnimeEpisodes()
            .add({ movieId: d.movieId, start: '0', end: d.episodeCount + '' });

          this.startInfo();
        },
        err => {
          console.log(err);
        }
      );
  }

  subscribeAnimeEpisodes() {
    return this.animeEpisodes$
      .pipe(
        concatMap(d => (d === null ? EMPTY : of(d))),
        tap(d => console.log('Start... Anime Episodes:', d.movieId)),
        concatMap(d =>
          this.service.loadAnimeEpidoes(d.movieId, d.start, d.end)
        ),
        tap(() => console.log('End... Anime Episodes.\n'))
      )
      .subscribe(() => {
        this.startEpisodes();
      });
  }

  subscribe() {
    this.animeListSubscription$ = this.subscribeAnimeList();
    this.animeInfoSubscription$ = this.subscribeAnimeInfo();
    this.animeEpisodesSubscription$ = this.subscribeAnimeEpisodes();
  }

  unsubscribe() {
    this.animeListSubscription$.unsubscribe();
    this.animeInfoSubscription$.unsubscribe();
    this.animeEpisodesSubscription$.unsubscribe();
  }

  startFresh() {
    this.animeList$.next(1);
  }

  startInfo() {
    const next = this.state.getAnimeInfo().get();

    if (next) {
      this.animeInfo$.next(next);
    }
  }

  startEpisodes() {
    const next = this.state.getAnimeEpisodes().get();

    if (next) {
      this.animeEpisodes$.next(next);
    }
  }
}
