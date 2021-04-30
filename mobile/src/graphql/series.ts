import { gql } from '@apollo/client';
import { IPaginatedData, ISeries, ISeriesBasic } from '../types';

export type DASHBOARD_ANIMES_TYPE = {
  animeShowcase: {
    popular: ISeriesBasic[];
    onGoingPopular: ISeriesBasic[];
    recentlyAdded: ISeriesBasic[];
  };
};

export const GET_DASHBOARD_ANIMES = gql`
  query AnimeShowcase {
    animeShowcase {
      popular {
        title
        thumbnail
        uuid
      }
      onGoingPopular {
        title
        thumbnail
        uuid
      }
      recentlyAdded {
        title
        thumbnail
        uuid
      }
    }
  }
`;

export type GetAnimeType = {
  series: {
    summary: string;
    released: string;
  };
};

export const GET_ANIME = gql`
  query GetAnime($uuid: String!) {
    series(uuid: $uuid) {
      summary
      released
    }
  }
`;

export type GetSeriesInfoType = {
  series: ISeries;
};

export const GET_SERIES_INFO = gql`
  query AnimeInfo($uuid: String!) {
    series(uuid: $uuid) {
      title
      type
      thumbnail
      summary
      released
      status
      genres {
        uuid
        name
      }
      episodes {
        uuid
        number
        title
      }
    }
  }
`;

export type GetVideoType = {
  episodeVideo: {
    episode: {
      link: string;
      videoId: string;
    };
    links: {
      name: string;
      link: string;
    }[];
  };
};

export const GET_VIDEO = gql`
  query GetEpisodeVideo($uuid: String!) {
    episodeVideo(uuid: $uuid) {
      episode {
        link
        videoId
      }
      links {
        name
        link
      }
    }
  }
`;

export type GetSeriesByGenreType = {
  seriesListByGenre: IPaginatedData<ISeriesBasic>;
};

export const GET_SERIES_BY_GENRE = gql`
  query GetSeriesByGenre($genre: String!, $query: PaginationQuery) {
    seriesListByGenre(genre: $genre, query: $query) {
      count
      limit
      offset
      data {
        uuid
        title
        thumbnail
      }
    }
  }
`;

export type SearchSeriesType = {
  seriesSearch: IPaginatedData<ISeriesBasic>;
};

export const SEARCH_SERIES = gql`
  query SearchSeries($query: String!, $option: PaginationQuery) {
    seriesSearch(query: $query, option: $option) {
      limit
      offset
      count
      data {
        uuid
        title
        thumbnail
      }
    }
  }
`;
