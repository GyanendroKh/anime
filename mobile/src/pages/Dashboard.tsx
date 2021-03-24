import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Button, Title } from 'react-native-paper';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import styles from '../styles';
import { HomeNavProps } from '../navigators';

type DiffClampCtx = {
  value: number;
  prevValue: number;
};

const APPBAR_HEIGHT = 50 + 8;
const minScroll = 100;

export const Dashboard: FC<HomeNavProps<'Dashboard'>> = ({ navigation }) => {
  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: (_, ctx: DiffClampCtx) => {
      ctx.value = ctx.prevValue = 0;
    },
    onScroll: ({ contentOffset: { y } }, ctx: DiffClampCtx) => {
      const clampedScrollY = interpolate(
        y,
        [minScroll, minScroll + 1],
        [0, 1],
        { extrapolateLeft: Extrapolate.CLAMP }
      );

      const minusScrollY = clampedScrollY * -1;

      // Custom diffClamp Implementation.
      const value = minusScrollY;
      const diff = value - ctx.prevValue;
      ctx.prevValue = value;
      ctx.value = Math.min(Math.max(ctx.value + diff, -APPBAR_HEIGHT), 0);

      translateY.value = ctx.value;
    }
  });

  const appBarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }]
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      marginTop: translateY.value
    };
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

const styles2 = StyleSheet.create({
  appBar: {
    height: APPBAR_HEIGHT
  },
  content: {
    height: 1000,
    backgroundColor: 'green',
    borderColor: 'blue',
    borderWidth: 5
  }
});
