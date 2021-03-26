import React, { FC, useEffect, useRef, useState } from 'react';
import { View, Dimensions, Image, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { List, Surface, Text, Title } from 'react-native-paper';
import Video from 'react-native-video';
import { theme } from '../constants';
import Icon from '../Icon';
import { HomeNavProps } from '../navigators';
import styles from '../styles';
import { ISeries } from '../types';

export type SeriesPlayProps = {
  anime: ISeries;
  episodeIndex: number;
};

const { width: baseWidth } = Dimensions.get('window');

export const SeriesPlay: FC<SeriesPlayProps> = ({ anime, episodeIndex }) => {
  const video = useRef<Video>();
  const [videoHeight, setVideoHeight] = useState<number>(() => {
    return (9 / 16) * baseWidth;
  });
  const [selectEpisode, setSelectedEpisode] = useState(episodeIndex);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <>
      <View
        style={[
          styles.center,
          {
            height: videoHeight
          }
        ]}
      >
        <Video
          ref={ref => (video.current = ref || undefined)}
          style={styles.absolute0}
          resizeMode="contain"
          playInBackground={false}
          playWhenInactive={false}
          source={{
            uri:
              'https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8',
            headers: {
              referer: 'https://kwik.cx/'
            }
          }}
          onLoadStart={() => {
            console.log('Started Loading...');
          }}
          onLoad={data => {
            const { width, height } = data.naturalSize;
            const newHeight = (height / width) * baseWidth;
            setVideoHeight(newHeight);
          }}
          onError={e => {
            console.log(e.error.errorString);
            console.log('Error:', e);
          }}
          onVideoError={console.log}
          controls={true}
        />
      </View>
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
              <Text style={styles2.detailInfoTitle}>{selectEpisode + 1}</Text>
            </View>
            <Text>{anime.episodesCount} Episodes</Text>
            <Text>{anime.status}</Text>
          </View>
        </View>
      </Surface>
      <View style={styles.height10} />
      <ScrollView>
        <Surface style={styles2.episodesSection}>
          <Title>Episodes</Title>
          <List.Section>
            {[...anime.episodes].reverse().map((a, idx) => {
              const borderRadius = {
                borderTopLeftRadius: idx === 0 ? 10 : 0,
                borderTopRightRadius: idx === 0 ? 10 : 0,
                borderBottomLeftRadius:
                  idx === anime.episodes.length - 1 ? 10 : 0,
                borderBottomRightRadius:
                  idx === anime.episodes.length - 1 ? 10 : 0
              };

              return (
                <List.Item
                  key={a.videoId}
                  title={a.name}
                  style={[
                    styles2.episodes,
                    borderRadius,
                    idx === selectEpisode ? styles2.episodeActive : {}
                  ]}
                  right={() => {
                    if (selectEpisode !== idx) {
                      return null;
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
  );
};

export const HomSeriesPlay: FC<HomeNavProps<'SeriesPlay'>> = ({
  route: { params }
}) => {
  return <SeriesPlay {...params} />;
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
