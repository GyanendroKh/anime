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

export interface IAnimeEpisodeRet<T = INameLinkRet> {
  movieId: string;
  episodes: T[];
}
