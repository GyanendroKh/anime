import { Injectable } from '@nestjs/common';
import { Queue } from '@anime/data';
import { INameLinkRet } from './go-go-anime.interface';

@Injectable()
export class GoGoAnimeState {
  private readonly animeList: Queue<number>;
  private readonly animeInfo: Queue<INameLinkRet>;
  private readonly animeEpisodes: Queue<{
    movieId: string;
    start: string;
    end: string;
  }>;

  constructor() {
    this.animeList = new Queue();
    this.animeInfo = new Queue();
    this.animeEpisodes = new Queue();
  }

  getAnimeList() {
    return this.animeList;
  }

  getAnimeInfo() {
    return this.animeInfo;
  }

  getAnimeEpisodes() {
    return this.animeEpisodes;
  }
}
