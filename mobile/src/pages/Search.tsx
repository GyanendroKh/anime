import { useQuery } from '@apollo/client';
import React, { FC, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ActivityIndicator, Searchbar, Title } from 'react-native-paper';
import { SeriesItem } from '../components';
import { SearchSeriesType, SEARCH_SERIES } from '../graphql/series';
import { ExploreNavProps, HomeNavProps } from '../navigators';
import styles2 from '../styles';
import { ISeriesBasic } from '../types';

const { width } = Dimensions.get('screen');
const imageWidth = width / 2 - 5 * 2;
const imageHeight = imageWidth * 1.35;

type SearchProps = {
  goBack?: () => void;
  onPress?: (series: ISeriesBasic) => void;
};

const Search: FC<SearchProps> = ({ goBack, onPress }) => {
  const [search, setSearch] = useState('');
  const { data, loading, fetchMore } = useQuery<SearchSeriesType>(
    SEARCH_SERIES,
    {
      variables: {
        query: search,
        option: {
          limit: 20,
          offset: 0
        }
      },
      notifyOnNetworkStatusChange: true
    }
  );

  const series = search.trim() === '' ? [] : data?.seriesSearch.data ?? [];
  const { count } = { count: data?.seriesSearch.count ?? 0 };

  return (
    <View style={styles2.flex1}>
      <View style={styles.searchBar}>
        <Searchbar
          value={search}
          placeholder="Search"
          onChangeText={setSearch}
          icon="arrow-left"
          onIconPress={goBack}
          clearIcon={
            loading ? props => <ActivityIndicator {...props} /> : 'close'
          }
        />
      </View>
      {series.length === 0 && (
        <View style={[styles2.center, styles2.flex1]}>
          <Title style={styles2.center}>Search for something.</Title>
        </View>
      )}
      {series.length !== 0 && (
        <FlatList
          contentContainerStyle={styles2.flexGrow1}
          data={series}
          keyExtractor={({ uuid }) => uuid}
          numColumns={2}
          onEndReachedThreshold={0.35}
          onEndReached={async () => {
            const hasNext = series.length < count;

            if (hasNext) {
              const offset = series.length;
              const limit = Math.min(count - series.length, 20);

              if (!loading) {
                await fetchMore({
                  variables: {
                    option: {
                      offset,
                      limit
                    }
                  }
                });
              }
            }
          }}
          renderItem={({ item }) => {
            return (
              <SeriesItem
                series={item}
                style={styles.itemStyle}
                image={{
                  height: imageHeight,
                  width: imageWidth
                }}
                onPress={() => {
                  if (onPress) {
                    onPress(item);
                  }
                }}
              />
            );
          }}
          ListFooterComponent={
            loading ? (
              <View style={styles.loadingIndicator}>
                <ActivityIndicator size={25} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

export const HomeSearch: FC<HomeNavProps<'Search'>> = ({ navigation }) => {
  return (
    <Search
      goBack={navigation.goBack}
      onPress={series => {
        navigation.push('Series', {
          series
        });
      }}
    />
  );
};

export const ExploreSearch: FC<ExploreNavProps<'Search'>> = ({
  navigation
}) => {
  return (
    <Search
      goBack={navigation.goBack}
      onPress={series => {
        navigation.push('Series', {
          series
        });
      }}
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    padding: 10
  },
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
