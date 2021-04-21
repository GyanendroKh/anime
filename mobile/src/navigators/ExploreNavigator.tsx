import {
  createStackNavigator,
  StackNavigationProp
} from '@react-navigation/stack';
import React, { FC } from 'react';
import { Browse, ExploreSeries, Genre } from '../pages';
import { IGenre, NavProps } from '../types';
import { SeriesParamList } from './SeriesNavigator';

type ExploreParamList = {
  Browse: undefined;
  Genres: {
    genre: IGenre;
  };
} & SeriesParamList;

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
      <Stack.Screen name="Genres" component={Genre} />
    </Stack.Navigator>
  );
};
