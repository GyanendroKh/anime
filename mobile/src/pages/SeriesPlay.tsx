import React, { FC, useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  ToastAndroid
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  List,
  Paragraph,
  Surface,
  Text,
  Title
} from 'react-native-paper';
import { useQuery } from 'react-query';
import Video from 'react-native-video-controls';
import Orientation from 'react-native-orientation-locker';
import { IAnime, IEntityBasic } from 'gogoanime-api';
import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';
import { theme } from '../constants';
import Icon from '../Icon';
import { ExploreNavProps, HomeNavProps } from '../navigators';
import styles from '../styles';
import Ads from '../Ads';
import { useGoGoAnime } from '../gogoAnime';

export type SeriesPlayProps = {
  anime: IAnime;
  episodes: IEntityBasic[];
  episodeIndex: number;
  onBack?: () => void;
};

const { width: baseWidth } = Dimensions.get('window');

export const SeriesPlay: FC<SeriesPlayProps> = ({
  anime,
  episodes,
  episodeIndex,
  onBack
}) => {
  const gogoAnime = useGoGoAnime();
  const [isFullScreen, setFullScreen] = useState(() => {
    const orientation = Orientation.getInitialOrientation();

    return (
      orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
    );
  });

  const [videoHeight, setVideoHeight] = useState<number>(() => {
    return (9 / 16) * baseWidth;
  });

  const [selectEpisode, setSelectedEpisode] = useState(episodeIndex);
  const episodeId = episodes[selectEpisode].id;

  const { data, error, isLoading: loading } = useQuery(
    ['animeEpisodeVideo', episodeId],
    async () => {
      const { videoId } = await gogoAnime.animeEpisodeInfo(episodeId);
      return await gogoAnime.animeEpisodeVideo(videoId);
    }
  );

  const videoLink = data?.source[0].file;

  useEffect(() => {
    if (isFullScreen) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }

    return () => {
      Orientation.lockToPortrait();
    };
  }, [isFullScreen]);

  return (
    <>
      <View
        style={[
          styles.center,
          isFullScreen
            ? styles.flex1
            : {
                height: videoHeight
              }
        ]}
      >
        {loading && <ActivityIndicator size={25} />}
        {error && (
          <>
            <Title>Error!</Title>
            <Paragraph>{String(error)}</Paragraph>
          </>
        )}
        {!loading && !error && (
          <Video
            style={[styles.fill]}
            resizeMode="contain"
            playInBackground={false}
            playWhenInactive={false}
            fullscreen={isFullScreen}
            onBack={onBack}
            source={{
              uri: videoLink,
              headers: {
                referer: 'https://googo-play.net',
                'user-agent':
                  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36'
              }
            }}
            onLoad={({ naturalSize: { height, width } }) => {
              setVideoHeight((height / width) * baseWidth);
            }}
            onError={e => {
              ToastAndroid.show('Error Playing Video!', ToastAndroid.SHORT);
              ToastAndroid.show(e.error.errorString, ToastAndroid.SHORT);
            }}
            onEnterFullscreen={() => {
              setFullScreen(true);
            }}
            onExitFullscreen={() => {
              setFullScreen(false);
            }}
            onVideoError={console.log}
          />
        )}
      </View>
      {!isFullScreen && (
        <>
          <Surface style={styles2.detail}>
            <View style={styles.flexRow}>
              <Image
                style={styles2.detailImage}
                source={{ uri: anime.thumbnail }}
                resizeMode="cover"
                resizeMethod="auto"
              />
              <View style={styles2.detailInfo}>
                <View style={styles.flexRow}>
                  <Text style={styles2.detailInfoTitle}>{anime.title} - </Text>
                  <Text style={styles2.detailInfoTitle}>
                    {episodes[selectEpisode].title}
                  </Text>
                </View>
                <Text>{episodes.length} Episodes</Text>
              </View>
            </View>
          </Surface>
          <View style={styles.height10} />
          <BannerAd
            unitId={Ads.BANNER_ID}
            size={BannerAdSize.ADAPTIVE_BANNER}
            onAdLoaded={() => {}}
            onAdOpened={() => {}}
            onAdClosed={() => {}}
            onAdFailedToLoad={() => {}}
            onAdLeftApplication={() => {}}
          />
          <View style={styles.height10} />
          <ScrollView>
            <Surface style={styles2.episodesSection}>
              <Title>Episodes</Title>
              <List.Section>
                {episodes.map((a, idx) => {
                  const borderRadius = {
                    borderTopLeftRadius: idx === 0 ? 10 : 0,
                    borderTopRightRadius: idx === 0 ? 10 : 0,
                    borderBottomLeftRadius:
                      idx === episodes.length - 1 ? 10 : 0,
                    borderBottomRightRadius:
                      idx === episodes.length - 1 ? 10 : 0
                  };

                  return (
                    <List.Item
                      key={a.id}
                      title={a.title}
                      style={[
                        styles2.episodes,
                        borderRadius,
                        idx === selectEpisode ? styles2.episodeActive : {}
                      ]}
                      right={() => {
                        if (selectEpisode !== idx) {
                          return null;
                        }

                        if (loading) {
                          return (
                            <ActivityIndicator
                              size={25}
                              color={theme.colors.onSurface}
                              style={styles.alignSelfCenter}
                            />
                          );
                        }

                        return (
                          <Icon
                            name="play"
                            size={25}
                            color={theme.colors.onSurface}
                            style={styles.alignSelfCenter}
                          />
                        );
                      }}
                      onPress={() => {
                        setSelectedEpisode(idx);
                      }}
                    />
                  );
                })}
              </List.Section>
            </Surface>
          </ScrollView>
        </>
      )}
    </>
  );
};

export const HomSeriesPlay: FC<HomeNavProps<'SeriesPlay'>> = ({
  navigation: { goBack },
  route: { params }
}) => {
  return <SeriesPlay {...params} onBack={goBack} />;
};

export const ExploreSeriesPlay: FC<ExploreNavProps<'SeriesPlay'>> = ({
  navigation: { goBack },
  route: { params }
}) => {
  return <SeriesPlay {...params} onBack={goBack} />;
};

const styles2 = StyleSheet.create({
  detail: {
    padding: 10
  },
  detailImage: {
    width: 80,
    height: 80,
    borderRadius: 5
  },
  detailInfo: {
    paddingHorizontal: 15,
    justifyContent: 'space-between'
  },
  detailInfoTitle: {
    fontSize: 17
  },
  episodesSection: {
    padding: 15
  },
  episodes: {
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  episodeActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
});
