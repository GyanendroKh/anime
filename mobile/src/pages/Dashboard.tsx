import React, { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Title } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { FlatList } from 'react-native-gesture-handler';
import { useCollapsibleAppbar } from '../hooks';
import styles from '../styles';
import { HomeNavProps } from '../navigators';
import { APPBAR_HEIGHT } from '../constants';
import { SeriesItem } from '../components';
import { useTopAnime, useTrendingAnime, useMyAnimeCollection } from '../states';
import { ISeriesBasic } from '../types';

const AnimeSection: FC<{
  title: string;
  animes: ISeriesBasic[];
  isLoading: boolean;
  fetch: () => Promise<void>;
  error: unknown;
  onPress?: (anime: ISeriesBasic) => void;
}> = ({ title, animes, error, fetch, isLoading, onPress }) => {
  useEffect(() => {
    fetch();
  }, [fetch]);

  if (isLoading || error) {
    if (error) {
      console.error(error);
    }

    return null;
  }

  return (
    <View style={styles2.sectionWrapper}>
      <Title>{title}</Title>
      <View style={styles.height10} />
      <FlatList
        data={animes}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={({ id }) => String(id)}
        renderItem={({ item }) => {
          return (
            <SeriesItem
              series={item}
              onPress={() => {
                if (onPress) {
                  onPress(item);
                }
              }}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.width10} />}
      />
    </View>
  );
};

export const Dashboard: FC<HomeNavProps<'Dashboard'>> = ({ navigation }) => {
  const topAnime = useTopAnime(state => state);
  const trendingAnime = useTrendingAnime(state => state);
  const myAnimeCollection = useMyAnimeCollection(state => state);

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
        <AnimeSection
          title="Top Animes"
          {...topAnime}
          onPress={anime => {
            console.log(anime);
            navigation.navigate('Series');
          }}
        />
        <AnimeSection
          title="Trending Animes"
          {...trendingAnime}
          onPress={anime => {
            console.log(anime);
            navigation.navigate('Series');
          }}
        />
        <AnimeSection
          title="My Collections"
          {...myAnimeCollection}
          onPress={anime => {
            console.log(anime);
            navigation.navigate('Series');
          }}
        />
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
