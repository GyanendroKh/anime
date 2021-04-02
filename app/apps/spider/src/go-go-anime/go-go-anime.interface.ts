export interface INameLinkRet {
  name: string;
  link: string;
}

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
export interface IAnimeEpisodeRet extends INameLinkRet {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAnimeVideLink extends INameLinkRet {}

export type IEventTypes = 'list' | 'info' | 'episodes';

export type IEventActions =
  | 'add'
  | 'add-multiple'
  | 'start'
  | 'finish'
  | 'running';

export interface IEvent<T> {
  type: IEventTypes;
  action: IEventActions;
  data: T;
}
