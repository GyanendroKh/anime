import {
  NavigationProp,
  ParamListBase,
  RouteProp
} from '@react-navigation/native';

export type NavProps<
  L extends ParamListBase,
  T extends keyof L,
  P extends NavigationProp<L, T>
> = {
  navigation: P;
  route: RouteProp<L, T>;
};

export type IGenre = {
  uuid: string;
  name: string;
};

export type IEpisode = {
  uuid: string;
  number: number;
  title: string;
};

export type ISeries = {
  title: string;
  type: string;
  thumbnail: string;
  summary: string;
  released: string;
  status: string;
  genres: IGenre[];
  episodes: IEpisode[];
};

export type ISeriesBasic = {
  uuid: string;
  title: string;
  thumbnail: string;
};

export interface IPaginatedData<T extends any> {
  start: number;
  end: number;
  count: number;
  data: T[];
}
