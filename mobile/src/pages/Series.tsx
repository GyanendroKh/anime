import React, { FC } from 'react';
import { View } from 'react-native';
import { Title } from 'react-native-paper';
import { ExploreNavProps, HomeNavProps } from '../navigators';
import { getParentRouteName } from '../uitls';
import styles from '../styles';

export type SeriesProps = {
  title: string;
};

export const Series: FC<SeriesProps> = ({ title }) => {
  return (
    <View style={[styles.center, styles.flex1]}>
      <Title>{title} Series</Title>
    </View>
  );
};

export const HomeSeries: FC<HomeNavProps<'Series'>> = ({ navigation }) => {
  return <Series title={getParentRouteName(navigation)} />;
};

export const ExploreSeries: FC<ExploreNavProps<'Series'>> = ({
  navigation
}) => {
  return <Series title={getParentRouteName(navigation)} />;
};
