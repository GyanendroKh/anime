import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  List,
  Paragraph,
  Surface,
  Title
} from 'react-native-paper';
import { useQuery } from 'react-query';
import Animated from 'react-native-reanimated';
import { Center } from '../components';
import { APPBAR_HEIGHT } from '../constants';
import { useCollapsibleAppbar } from '../hooks';
import { ExploreNavProps } from '../navigators';
import styles from '../styles';
import { useGoGoAnime } from '../gogoAnime';

export const Browse: FC<ExploreNavProps<'Browse'>> = ({ navigation }) => {
  const gogoAnime = useGoGoAnime();
  const { scrollHandler, appBarStyle, contentStyle } = useCollapsibleAppbar({
    appBarHeight: APPBAR_HEIGHT
  });
  const { data, isLoading: loading, error } = useQuery('genres', () =>
    gogoAnime.genres()
  );

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
        <View style={styles2.content}>
          {error && (
            <Center flex={true}>
              <Title>Error!</Title>
              <Paragraph>{String(error)}</Paragraph>
            </Center>
          )}
          <Surface style={styles2.section}>
            <List.Accordion
              title="Genres"
              left={
                loading ? props => <ActivityIndicator {...props} /> : undefined
              }
            >
              {data?.map(g => {
                return (
                  <List.Item
                    key={g.id}
                    title={g.title}
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
