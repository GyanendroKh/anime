import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import {
  BottomTabNavigationProp,
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';
import { toIcon } from '../Icon';
import { NavProps } from '../types';
import { HomeNavigator } from './HomeNavigator';
import { ExploreNavigator } from './ExploreNavigator';

type MainNavParamList = {
  Home: undefined;
  Explore: undefined;
};

export type MainNavProps<T extends keyof MainNavParamList> = NavProps<
  MainNavParamList,
  T,
  BottomTabNavigationProp<MainNavParamList, T>
>;

const Tab = createBottomTabNavigator<MainNavParamList>();

export const MainNavigator: FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        style: styles.tabWrapper
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: props => toIcon('home', props)
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreNavigator}
        options={{
          tabBarIcon: props => toIcon('movie-open', props)
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabWrapper: {
    margin: 8
  }
});
