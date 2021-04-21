import { gql } from '@apollo/client';
import { IGenre } from '../types';

export type GetGenresType = {
  genreGetAll: IGenre[];
};

export const GET_GENRES = gql`
  query getGenres {
    genreGetAll {
      name
      uuid
    }
  }
`;
