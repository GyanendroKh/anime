import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Title } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { FlatList } from 'react-native-gesture-handler';
import { useCollapsibleAppbar } from '../hooks';
import styles from '../styles';
import { HomeNavProps } from '../navigators';
import { APPBAR_HEIGHT } from '../constants';
import { SeriesItem } from '../components';

export const Dashboard: FC<HomeNavProps<'Dashboard'>> = ({ navigation }) => {
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
        <View style={styles2.sectionWrapper}>
          <Title>Top Anime</Title>
          <View style={styles.height10} />
          <FlatList
            data={[1, 2, 3, 4, 5]}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, idx) => String(idx)}
            renderItem={({ item }) => {
              return (
                <SeriesItem
                  series={item}
                  onPress={async () => {
                    navigation.navigate('Series');
                  }}
                />
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.width10} />}
          />
        </View>
        <View style={styles2.sectionWrapper}>
          <Title>Trending</Title>
          <View style={styles.height10} />
          <FlatList
            data={[1, 2, 3, 4, 5]}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, idx) => String(idx)}
            renderItem={({ item }) => {
              return (
                <SeriesItem
                  series={item}
                  onPress={async () => {
                    navigation.navigate('Series');
                  }}
                />
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.width10} />}
          />
        </View>
        <View style={styles2.sectionWrapper}>
          <Title>Your Collections</Title>
          <View style={styles.height10} />
          <FlatList
            data={[1, 2, 3, 4, 5]}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, idx) => String(idx)}
            renderItem={({ item }) => {
              return (
                <SeriesItem
                  series={item}
                  onPress={async () => {
                    navigation.navigate('Series');
                  }}
                />
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.width10} />}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles2 = StyleSheet.create({
  appBar: {
    height: APPBAR_HEIGHT
  },
  sectionWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 5
  }
});
