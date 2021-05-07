import {
  createStackNavigator,
  StackNavigationProp
} from '@react-navigation/stack';
import { IEntityBasic } from 'gogoanime-api';
import React, { FC } from 'react';
import {
  Browse,
  ExploreSeries,
  Genre,
  ExploreSearch,
  ExploreSeriesPlay
} from '../pages';
import { NavProps } from '../types';
import { SearchParamList } from './SearchNavigator';
import { SeriesParamList } from './SeriesNavigator';

type ExploreParamList = {
  Browse: undefined;
  Genres: {
    genre: IEntityBasic;
  };
} & SeriesParamList &
  SearchParamList;

export type ExploreNavProps<T extends keyof ExploreParamList> = NavProps<
  ExploreParamList,
  T,
  StackNavigationProp<ExploreParamList, T>
>;

const Stack = createStackNavigator<ExploreParamList>();

export const ExploreNavigator: FC = () => {
  return (
    <Stack.Navigator initialRouteName="Browse" headerMode="none">
      <Stack.Screen name="Browse" component={Browse} />
      <Stack.Screen name="Series" component={ExploreSeries} />
      <Stack.Screen name="SeriesPlay" component={ExploreSeriesPlay} />
      <Stack.Screen name="Genres" component={Genre} />
      <Stack.Screen name="Search" component={ExploreSearch} />
    </Stack.Navigator>
  );
};
