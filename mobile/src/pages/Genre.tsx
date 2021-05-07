import React, { FC, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Paragraph,
  Text,
  Title
} from 'react-native-paper';
import { useQuery } from 'react-query';
import { Center, SeriesItem } from '../components';
import { theme } from '../constants';
import { useGoGoAnime } from '../gogoAnime';
import { ExploreNavProps } from '../navigators';
import styles from '../styles';

const { width } = Dimensions.get('screen');
const imageWidth = width / 2 - 5 * 2;
const imageHeight = imageWidth * 1.35;

export const Genre: FC<ExploreNavProps<'Genres'>> = ({
  route: {
    params: { genre }
  },
  navigation
}) => {
  const gogoAnime = useGoGoAnime();

  const [page, setPage] = useState(1);
  const { data, error, isLoading: loading } = useQuery(
    ['genreList', genre.id, page],
    () => {
      return gogoAnime.genreList(genre.id, page);
    }
  );

  return (
    <View style={styles.flex1}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.pop()} />
        <Appbar.Content title={genre.title} />
      </Appbar.Header>
      {loading && (
        <Center flex={true}>
          <ActivityIndicator size={25} />
        </Center>
      )}
      {error && (
        <Center flex={true}>
          <Title>Error!</Title>
          <Paragraph>{String(error)}</Paragraph>
        </Center>
      )}
      {data && (
        <FlatList
          data={data.data ?? []}
          keyExtractor={({ id }) => id}
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
            <View style={styles2.paginationWrapper}>
              {data?.paginations.map(p => {
                return (
                  <>
                    <TouchableOpacity
                      key={p}
                      onPress={() => {
                        setPage(p);
                      }}
                      style={[
                        styles2.paginationItem,
                        p === page ? styles2.paginationItemActive : {}
                      ]}
                    >
                      <Text>{p}</Text>
                    </TouchableOpacity>
                  </>
                );
              })}
            </View>
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
