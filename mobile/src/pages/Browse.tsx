import { useQuery } from '@apollo/client';
import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, List, Surface } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import Ads from '../Ads';
import { Margin } from '../components';
import { APPBAR_HEIGHT } from '../constants';
import { GetGenresType, GET_GENRES } from '../graphql/genre';
import { useCollapsibleAppbar } from '../hooks';
import { ExploreNavProps } from '../navigators';
import styles from '../styles';

export const Browse: FC<ExploreNavProps<'Browse'>> = ({ navigation }) => {
  const { scrollHandler, appBarStyle, contentStyle } = useCollapsibleAppbar({
    appBarHeight: APPBAR_HEIGHT
  });
  const { data, loading } = useQuery<GetGenresType>(GET_GENRES);

  return (
    <View style={styles.flex1}>
      <Animated.View style={[styles2.appBar, appBarStyle]}>
        <Appbar.Header>
          <Appbar.Content title="Anime" />
          <Appbar.Action
            icon="magnify"
            onPress={() => {
              navigation.navigate('Search');
            }}
          />
        </Appbar.Header>
      </Animated.View>
      <Animated.ScrollView style={contentStyle} onScroll={scrollHandler}>
        <View style={styles2.content}>
          <Surface style={styles2.section}>
            <List.Accordion
              title="Genres"
              left={
                loading ? props => <ActivityIndicator {...props} /> : undefined
              }
            >
              {data?.genreGetAll.map(g => {
                return (
                  <List.Item
                    key={g.uuid}
                    title={g.name}
                    onPress={() => {
                      navigation.navigate('Genres', {
                        genre: g
                      });
                    }}
                  />
                );
              })}
            </List.Accordion>
          </Surface>
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
    padding: 5
  },
  section: {
    borderRadius: 5
  }
});
