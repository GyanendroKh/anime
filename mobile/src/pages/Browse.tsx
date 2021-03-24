import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Button, Title } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { APPBAR_HEIGHT } from '../constants';
import { useCollapsibleAppbar } from '../hooks';
import { ExploreNavProps } from '../navigators';
import styles from '../styles';

export const Browse: FC<ExploreNavProps<'Browse'>> = ({ navigation }) => {
  const { scrollHandler, appBarStyle, contentStyle } = useCollapsibleAppbar({
    appBarHeight: APPBAR_HEIGHT
  });
  return (
    <View style={styles.flex1}>
      <Animated.View style={[styles2.appBar, appBarStyle]}>
        <Appbar.Header>
          <Appbar.Content title="Anime" />
        </Appbar.Header>
      </Animated.View>
      <Animated.ScrollView style={contentStyle} onScroll={scrollHandler}>
        <View style={[styles.center, styles2.content]}>
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
      </Animated.ScrollView>
    </View>
  );
};

const styles2 = StyleSheet.create({
  appBar: {
    height: APPBAR_HEIGHT
  },
  content: {
    height: 1000
  }
});
