import React, { FC } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useQuery } from 'react-query';
import { Appbar, Title } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { IEntity } from 'gogoanime-api';
import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';
import { useGoGoAnime } from '../gogoAnime';
import { useCollapsibleAppbar } from '../hooks';
import styles from '../styles';
import { HomeNavProps } from '../navigators';
import { APPBAR_HEIGHT } from '../constants';
import { Margin, SeriesItem } from '../components';
import Ads from '../Ads';

const AnimeSection: FC<{
  title: string;
  animes: IEntity[];
  onPress?: (anime: IEntity) => void;
}> = ({ title, animes, onPress }) => {
  return (
    <View style={styles2.sectionWrapper}>
      <Title>{title}</Title>
      <View style={styles.height10} />
      <FlatList
        data={animes}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={({ id }) => id}
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
  const gogoAnime = useGoGoAnime();

  const { data: recentRelease } = useQuery('recentRelease', async () => {
    return await gogoAnime.recentRelease();
  });
  const { data: popularOnGoing } = useQuery('popularOngoing', async () => {
    return await gogoAnime.popularOnGoingSeries();
  });

  const { scrollHandler, appBarStyle, contentStyle } = useCollapsibleAppbar({
    appBarHeight: APPBAR_HEIGHT
  });

  return (
    <View style={styles.flex1}>
      <Animated.View style={[styles2.appBar, appBarStyle]}>
        <Appbar.Header>
          <Appbar.Content title="Arch Anime" />
          <Appbar.Action
            icon="magnify"
            onPress={() => {
              navigation.navigate('Search');
            }}
          />
        </Appbar.Header>
      </Animated.View>
      <Animated.ScrollView style={contentStyle} onScroll={scrollHandler}>
        {recentRelease && (
          <AnimeSection
            title="Recent Release"
            animes={recentRelease.data.map(a => ({
              ...a,
              id: a.id.split('-episode')[0]
            }))}
            onPress={series => {
              navigation.navigate('Series', { series });
            }}
          />
        )}
        <Margin marginVertical={5}>
          <BannerAd
            unitId={Ads.BANNER_ID}
            size={BannerAdSize.ADAPTIVE_BANNER}
            onAdLoaded={() => {}}
            onAdOpened={() => {}}
            onAdClosed={() => {}}
            onAdFailedToLoad={() => {}}
            onAdLeftApplication={() => {}}
          />
        </Margin>
        {popularOnGoing && (
          <AnimeSection
            title="Popular OnGoing"
            animes={popularOnGoing.data}
            onPress={series => {
              navigation.navigate('Series', { series });
            }}
          />
        )}
        <Margin marginVertical={5}>
          <BannerAd
            unitId={Ads.BANNER_ID}
            size={BannerAdSize.ADAPTIVE_BANNER}
            onAdLoaded={() => {}}
            onAdOpened={() => {}}
            onAdClosed={() => {}}
            onAdFailedToLoad={() => {}}
            onAdLeftApplication={() => {}}
          />
        </Margin>
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
