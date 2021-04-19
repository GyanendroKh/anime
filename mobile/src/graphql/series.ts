import { gql } from '@apollo/client';
import { ISeries, ISeriesBasic } from '../types';

export type DASHBOARD_ANIMES_TYPE = {
  topAnimes: {
    data: ISeriesBasic[];
  };
  trendingAnimes: {
    data: ISeriesBasic[];
  };
  myCollections: {
    data: ISeriesBasic[];
  };
};

export const GET_DASHBOARD_ANIMES = gql`
  query TopAnimes {
    topAnimes: seriesList(query: { start: 1230, end: 1235 }) {
      data {
        uuid
        thumbnail
        title
      }
    }
    trendingAnimes: seriesList(query: { start: 1330, end: 1335 }) {
      data {
        uuid
        thumbnail
        title
      }
    }
    myCollections: seriesList(query: { start: 130, end: 135 }) {
      data {
        uuid
        thumbnail
        title
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
