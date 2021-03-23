import {
  createStackNavigator,
  StackNavigationProp
} from '@react-navigation/stack';
import React, { FC } from 'react';
import { Browse, ExploreSeries } from '../pages';
import { NavProps } from '../types';
import { SeriesParamList } from './SeriesNavigator';

type ExploreParamList = {
  Browse: undefined;
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
    </Stack.Navigator>
  );
};
