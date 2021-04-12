export interface INameLinkRet {
  name: string;
  link: string;
}

export type INameLinkIdRet = INameLinkRet & { id: string };

export interface IAnimeListRet {
  pageNo: number;
  list: INameLinkRet[];
  paginations: number[];
}

export interface IAnimeInfoRet {
  link: string;
  movieId: string;
  image: string;
  title: string;
  type?: string;
  summary?: string;
  genres: string[];
  released?: string;
  status?: string;
  otherNames: string[];
  episodeCount: number;
  episodePages: {
    start: number;
    end: number;
  }[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAnimeEpisodeRet<T = INameLinkRet> {
  movieId: string;
  episodes: T[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAnimeVideLink extends INameLinkRet {}

export type IEventTypes = 'runner' | 'list' | 'info' | 'episodes';

export type IEventActions =
  | 'add'
  | 'add-multiple'
  | 'start'
  | 'finish'
  | 'running';

export interface IEvent<T = any, K = any> {
  type: IEventTypes;
  action: IEventActions;
  data: T;
  extra: K;
}

export interface IEpisodeRunner {
  movieId: string;
  start: number;
  end: number;
}
