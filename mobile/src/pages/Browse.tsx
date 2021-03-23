import React, { FC } from 'react';
import { View } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { ExploreNavProps } from '../navigators';
import styles from '../styles';

export const Browse: FC<ExploreNavProps<'Browse'>> = ({ navigation }) => {
  return (
    <View style={[styles.flex1, styles.center]}>
      <Title>Browse</Title>
      <Button
        mode="contained"
        onPress={() => {
          navigation.navigate('Series');
        }}
      >
        Series
      </Button>
    </View>
  );
};
