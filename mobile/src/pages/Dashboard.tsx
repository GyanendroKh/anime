import React, { FC } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useQuery } from '@apollo/client';
import { Appbar, Title } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';
import { useCollapsibleAppbar } from '../hooks';
import styles from '../styles';
import { HomeNavProps } from '../navigators';
import { APPBAR_HEIGHT } from '../constants';
import { Margin, SeriesItem } from '../components';
import { ISeriesBasic } from '../types';
import { DASHBOARD_ANIMES_TYPE, GET_DASHBOARD_ANIMES } from '../graphql/series';
import Ads from '../Ads';

const AnimeSection: FC<{
  title: string;
  animes: ISeriesBasic[];
  onPress?: (anime: ISeriesBasic) => void;
}> = ({ title, animes, onPress }) => {
  return (
    <View style={styles2.sectionWrapper}>
      <Title>{title}</Title>
      <View style={styles.height10} />
      <FlatList
        data={animes}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={({ uuid }) => String(uuid)}
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
  const { data } = useQuery<DASHBOARD_ANIMES_TYPE>(GET_DASHBOARD_ANIMES);

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
      {data !== undefined && (
        <Animated.ScrollView style={contentStyle} onScroll={scrollHandler}>
          <AnimeSection
            title="Top Animes"
            animes={data.topAnimes.data}
            onPress={anime => {
              navigation.navigate('Series', {
                series: anime
              });
            }}
          />
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
          <AnimeSection
            title="Trending Animes"
            animes={data.trendingAnimes.data}
            onPress={anime => {
              navigation.navigate('Series', {
                series: anime
              });
            }}
          />
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
          <AnimeSection
            title="My Collections"
            animes={data.myCollections.data}
            onPress={anime => {
              navigation.navigate('Series', {
                series: anime
              });
            }}
          />
        </Animated.ScrollView>
      )}
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
