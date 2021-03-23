import React, { FC } from 'react';
import { View } from 'react-native';
import { Appbar, Button, Title } from 'react-native-paper';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import styles from '../styles';
import { HomeNavProps } from '../navigators';

export const Dashboard: FC<HomeNavProps<'Dashboard'>> = ({ navigation }) => {
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      console.log(e.contentOffset.y);
    }
  });

  return (
    <View style={styles.flex1}>
      <Animated.ScrollView onScroll={scrollHandler}>
        <Appbar.Header>
          <Appbar.Content title="Anime" />
        </Appbar.Header>
        <View style={[styles.center]}>
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
      </Animated.ScrollView>
    </View>
  );
};
