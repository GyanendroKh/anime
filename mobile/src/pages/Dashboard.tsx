import React, { FC } from 'react';
import { View } from 'react-native';
import { Button, Title } from 'react-native-paper';
import styles from '../styles';
import { HomeNavProps } from '../navigators';

export const Dashboard: FC<HomeNavProps<'Dashboard'>> = ({ navigation }) => {
  return (
    <View style={[styles.flex1, styles.center]}>
      <Title>Dashboard</Title>
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
