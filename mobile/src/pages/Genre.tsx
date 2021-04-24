import React, { FC } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Paragraph,
  Title
} from 'react-native-paper';
import { useQuery } from '@apollo/client';
import { Center, SeriesItem } from '../components';
import { GetSeriesByGenreType, GET_SERIES_BY_GENRE } from '../graphql/series';
import { ExploreNavProps } from '../navigators';
import styles from '../styles';
import { ISeriesBasic } from '../types';

const { width } = Dimensions.get('screen');
const imageWidth = width / 2 - 5 * 2;
const imageHeight = imageWidth * 1.35;

export const Genre: FC<ExploreNavProps<'Genres'>> = ({
  route: {
    params: { genre }
  },
  navigation
}) => {
  const { data, loading, error, fetchMore } = useQuery<GetSeriesByGenreType>(
    GET_SERIES_BY_GENRE,
    {
      variables: {
        genre: genre.uuid,
        query: {
          offset: 0,
          limit: 20
        }
      },
      notifyOnNetworkStatusChange: true
    }
  );

  return (
    <View style={styles.flex1}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.pop()} />
        <Appbar.Content title={genre.name} />
      </Appbar.Header>
      {loading && (
        <Center flex={true}>
          <ActivityIndicator size={25} />
        </Center>
      )}
      {error && (
        <Center flex={true}>
          <Title>Error!</Title>
          <Paragraph>{error.message}</Paragraph>
        </Center>
      )}
      {data && (
        <FlatList
          data={(data?.seriesListByGenre.data ?? []) as ISeriesBasic[]}
          keyExtractor={({ uuid }) => uuid}
          onEndReached={async () => {
            const hasNext =
              data.seriesListByGenre.data.length < data.seriesListByGenre.count;

            if (hasNext) {
              const offset = data.seriesListByGenre.data.length;
              const limit = Math.min(
                data.seriesListByGenre.count -
                  data.seriesListByGenre.data.length,
                20
              );

              if (!loading) {
                await fetchMore({
                  variables: {
                    query: {
                      offset,
                      limit
                    }
                  }
                });
              }
            }
          }}
          onEndReachedThreshold={0.35}
          refreshing={loading}
          numColumns={2}
          renderItem={({ item }) => {
            return (
              <SeriesItem
                series={item}
                style={styles2.itemStyle}
                image={{
                  height: imageHeight,
                  width: imageWidth
                }}
                onPress={() => {
                  navigation.navigate('Series', { series: item });
                }}
              />
            );
          }}
          ListFooterComponent={
            loading ? (
              <View style={styles2.loadingIndicator}>
                <ActivityIndicator size={25} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles2 = StyleSheet.create({
  itemStyle: {
    width: width / 2,
    paddingHorizontal: 5,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingIndicator: {
    padding: 15
  }
});
