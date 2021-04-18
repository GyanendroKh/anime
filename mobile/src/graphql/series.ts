import { gql } from '@apollo/client';
import { ISeriesBasic } from '../types';

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
