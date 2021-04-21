import React, { FC } from 'react';
import {
  createStackNavigator,
  StackNavigationProp
} from '@react-navigation/stack';
import { NavProps } from '../types';
import { MainNavProps } from './MainNavigator';
import { Dashboard, HomeSearch, HomeSeries, HomSeriesPlay } from '../pages';
import { SeriesParamList } from './SeriesNavigator';
import { SearchParamList } from './SearchNavigator';

type HomeParamList = {
  Dashboard: undefined;
} & SeriesParamList &
  SearchParamList;

export type HomeNavProps<T extends keyof HomeParamList> = NavProps<
  HomeParamList,
  T,
  StackNavigationProp<HomeParamList, T>
>;

const Stack = createStackNavigator<HomeParamList>();

export const HomeNavigator: FC<MainNavProps<'Home'>> = () => {
  return (
    <Stack.Navigator initialRouteName="Dashboard" headerMode="none">
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Series" component={HomeSeries} />
      <Stack.Screen name="SeriesPlay" component={HomSeriesPlay} />
      <Stack.Screen name="Search" component={HomeSearch} />
    </Stack.Navigator>
  );
};
