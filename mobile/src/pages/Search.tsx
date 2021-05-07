import React, { FC, useState } from 'react';
import { Dimensions, StyleSheet, View, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Paragraph,
  Searchbar,
  Text,
  Title
} from 'react-native-paper';
import { useQuery } from 'react-query';
import { Center, SeriesItem } from '../components';
import { theme } from '../constants';
import { useGoGoAnime } from '../gogoAnime';
import { ExploreNavProps, HomeNavProps } from '../navigators';
import styles2 from '../styles';

const { width } = Dimensions.get('screen');
const imageWidth = width / 2 - 5 * 2;
const imageHeight = imageWidth * 1.35;

type SearchProps = {
  goBack?: () => void;
  onPress?: (series: any) => void;
};

const Search: FC<SearchProps> = ({ goBack, onPress }) => {
  const gogoAnime = useGoGoAnime();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: series, isLoading: loading, error } = useQuery(
    ['search', search, page],
    async () => {
      return await gogoAnime.search(search, page);
    },
    {
      enabled: search !== ''
    }
  );

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
      {error && (
        <Center flex={true}>
          <Title>Error!</Title>
          <Paragraph>{String(error)}</Paragraph>
        </Center>
      )}
      <FlatList
        contentContainerStyle={styles2.flexGrow1}
        data={series?.data ?? []}
        keyExtractor={({ id }) => id}
        numColumns={2}
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
        ListEmptyComponent={
          <>
            {!loading && (
              <View style={[styles2.center, styles2.flex1]}>
                <Title style={styles2.center}>Search for something.</Title>
              </View>
            )}
          </>
        }
        ListFooterComponent={
          <>
            {series?.data.length !== 0 && (
              <>
                <View style={styles.paginationWrapper}>
                  {series?.paginations.map(p => {
                    return (
                      <>
                        <TouchableOpacity
                          key={p}
                          onPress={() => {
                            setPage(p);
                          }}
                          style={[
                            styles.paginationItem,
                            p === page ? styles.paginationItemActive : {}
                          ]}
                        >
                          <Text>{p}</Text>
                        </TouchableOpacity>
                      </>
                    );
                  })}
                </View>
              </>
            )}
          </>
        }
      />
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
  },
  paginationWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderTopColor: theme.colors.backdrop,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
    paddingBottom: 5
  },
  paginationItem: {
    paddingHorizontal: 35,
    paddingVertical: 10
  },
  paginationItemActive: {
    borderTopColor: theme.colors.primary,
    borderTopWidth: 2
  }
});
