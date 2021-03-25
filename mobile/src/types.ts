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

export type ISeries = {
  name: string;
  link: string;
  movieId: string;
  title: string;
  thumbnail: string;
  summary: string;
  genres: string[];
  released: string;
  status: string;
  episodesCount: number;
  episodes: {
    name: string;
    link: string;
    videoId: string;
  }[];
};

export type ISeriesBasic = {
  id: string;
  name: string;
  thumbnail: string;
};
