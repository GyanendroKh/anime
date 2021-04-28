import { IAnimeInfoRet } from '@app/scrapper';

export interface IEpisodeJob {
  movieId: string;
  count: number;
}

export interface IRecentReleaseJob {
  pageNo: number;
  extras?: Array<IAnimeInfoRet>;
}
