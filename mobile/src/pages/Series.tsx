import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';
import React, { FC, useMemo, useState } from 'react';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useQuery } from 'react-query';
import LinearGradient from 'react-native-linear-gradient';
import {
  IconButton,
  List,
  Paragraph,
  Subheading,
  Surface,
  Title,
  TouchableRipple
} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { IAnime, IEntity, IEntityBasic } from 'gogoanime-api';
import Ads from '../Ads';
import { Center } from '../components';
import { theme } from '../constants';
import { useGoGoAnime } from '../gogoAnime';
import { ExploreNavProps, HomeNavProps } from '../navigators';
import styles from '../styles';

const { width } = Dimensions.get('screen');
const imageWidth = width;
const imageHeight = width * 1.25;
const imageNegativeMargin = 15;
const contentMarginTop = imageHeight * 0.45;
const contentPaddingBottom = 40;

export type SeriesProps = {
  series: IEntity;
  onBackBtnPress?: () => void;
  onEpisodePress?: (data: {
    anime: IAnime;
    episodes: IEntityBasic[];
    episodeIndex: number;
  }) => void;
};

export const Series: FC<SeriesProps> = ({
  series,
  onBackBtnPress,
  onEpisodePress
}) => {
  const gogoAnime = useGoGoAnime();

  const [selectedContentHeader, setSelectedContentHeader] = useState<
    'info' | 'episodes'
  >('info');

  const { data: anime, isLoading, error } = useQuery(
    ['animeInfo', series.id],
    async () => {
      return await gogoAnime.animeInfo(series.id);
    }
  );

  const { data: animeEpisodes } = useQuery(
    ['animeEpisode', anime?.movieId],
    async () => {
      return await gogoAnime.animeEpisodes(
        anime?.movieId ?? '',
        0,
        anime?.episodeCount ?? 0
      );
    },
    {
      enabled: !!anime
    }
  );

  const episodes = useMemo(() => {
    return animeEpisodes?.sort((a, b) => {
      return (
        Number(a.title.toLowerCase().replace('ep', '').trim()) -
        Number(b.title.toLowerCase().replace('ep', '').trim())
      );
    });
  }, [animeEpisodes]);

  return (
    <>
      <View style={styles2.imageWrapper}>
        <Image
          source={{ uri: series.thumbnail }}
          style={{ width: imageWidth, height: imageHeight }}
          width={imageWidth}
          height={imageHeight}
        />
        <IconButton
          icon="arrow-left"
          style={styles2.backBtn}
          onPress={onBackBtnPress}
        />
      </View>
      <Animated.ScrollView
        contentContainerStyle={styles.flexGrow1}
        showsVerticalScrollIndicator={false}
      >
        <View style={[{ marginTop: contentMarginTop }, styles.flex1]}>
          <LinearGradient
            colors={[
              'rgba(1, 0, 0, 0.0)',
              'rgba(0, 0, 0, 0.3)',
              'rgba(0, 0, 0, 0.6)',
              'rgba(0, 0, 0, 0.7)',
              'rgba(0, 0, 0, 0.8)',
              'rgba(0, 0, 0, 0.9)',
              'rgba(0, 0, 0, 0.9)'
            ]}
            style={styles2.contentHeader}
          >
            <Title>{series.title}</Title>
            {anime && anime.released && (
              <Subheading>Released: {anime?.released}</Subheading>
            )}
          </LinearGradient>
          <>
            <Surface style={[styles2.contentDetails, styles.flexGrow1]}>
              <View style={styles2.contentDetailsHeader}>
                <TouchableRipple
                  style={[
                    styles2.contentDetailsHeaderItem,
                    selectedContentHeader === 'info'
                      ? styles2.contentDetailsHeaderItemActive
                      : {}
                  ]}
                  onPress={() => {
                    setSelectedContentHeader('info');
                  }}
                >
                  <Title>Info</Title>
                </TouchableRipple>
                <TouchableRipple
                  style={[
                    styles2.contentDetailsHeaderItem,
                    selectedContentHeader === 'episodes'
                      ? styles2.contentDetailsHeaderItemActive
                      : {}
                  ]}
                  onPress={() => {
                    setSelectedContentHeader('episodes');
                  }}
                >
                  <Title>Episodes</Title>
                </TouchableRipple>
              </View>
              <View
                style={
                  selectedContentHeader === 'info'
                    ? styles.displayFlex
                    : styles.displayNone
                }
              >
                {isLoading && (
                  <Center flex={true}>
                    <ActivityIndicator size={25} color={theme.colors.primary} />
                  </Center>
                )}
                {error && !isLoading && (
                  <Center flex={true}>
                    <Title>Error!</Title>
                    <Paragraph>{String(error)}</Paragraph>
                  </Center>
                )}
                <Paragraph>{anime?.summary}</Paragraph>
              </View>
              <View
                style={
                  selectedContentHeader === 'episodes'
                    ? styles.displayFlex
                    : styles.displayNone
                }
              >
                {anime &&
                  episodes &&
                  episodes?.map((episode, idx) => {
                    return (
                      <List.Item
                        key={episode.id}
                        title={episode.title}
                        onPress={() => {
                          if (onEpisodePress) {
                            onEpisodePress({
                              anime: anime,
                              episodes: episodes,
                              episodeIndex: idx
                            });
                          }
                        }}
                      />
                    );
                  })}
              </View>
            </Surface>
            <BannerAd
              unitId={Ads.BANNER_ID}
              size={BannerAdSize.ADAPTIVE_BANNER}
              onAdLoaded={() => {}}
              onAdOpened={() => {}}
              onAdClosed={() => {}}
              onAdFailedToLoad={() => {}}
              onAdLeftApplication={() => {}}
            />
          </>
        </View>
      </Animated.ScrollView>
    </>
  );
};

export const HomeSeries: FC<HomeNavProps<'Series'>> = ({
  navigation,
  route: {
    params: { series }
  }
}) => {
  return (
    <Series
      series={series}
      onEpisodePress={({ anime, episodes, episodeIndex }) => {
        navigation.navigate('SeriesPlay', { anime, episodes, episodeIndex });
      }}
      onBackBtnPress={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }}
    />
  );
};

export const ExploreSeries: FC<ExploreNavProps<'Series'>> = ({
  navigation,
  route: {
    params: { series }
  }
}) => {
  return (
    <Series
      series={series}
      onEpisodePress={({ anime, episodes, episodeIndex }) => {
        navigation.navigate('SeriesPlay', { anime, episodes, episodeIndex });
      }}
      onBackBtnPress={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }}
    />
  );
};

const styles2 = StyleSheet.create({
  imageWrapper: {
    position: 'absolute',
    top: -imageNegativeMargin
  },
  backBtn: {
    position: 'absolute',
    marginTop: 10 + imageNegativeMargin,
    marginHorizontal: 10,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    zIndex: 999
  },
  contentHeader: {
    paddingHorizontal: 15,
    paddingTop: 25,
    paddingBottom: contentPaddingBottom
  },
  contentDetails: {
    marginTop: -(contentPaddingBottom - 10),
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 15
  },
  contentDetailsHeader: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 15
  },
  contentDetailsHeaderItem: {
    flexGrow: 1,
    alignItems: 'center'
  },
  contentDetailsHeaderItemActive: {
    borderBottomColor: theme.colors.primary,
    borderBottomWidth: 2
  }
});
