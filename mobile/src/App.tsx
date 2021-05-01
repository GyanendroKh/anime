import 'react-native-gesture-handler';
import React, { FC, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import codePush from 'react-native-code-push';
import { Provider as PaperProvider } from 'react-native-paper';
import {
  NavigationContainer,
  NavigationContainerRef
} from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import analytics from '@react-native-firebase/analytics';
import { RootNavigator } from './navigators';
import { theme } from './constants';
import {
  ApolloClient,
  ApolloProvider,
  FieldPolicy,
  InMemoryCache
} from '@apollo/client';
import { IPaginatedData } from './types';

const paginationMerge = (
  keyArgs: FieldPolicy<any>['keyArgs'] = false
): FieldPolicy<IPaginatedData<any>> => {
  return {
    keyArgs,
    merge(existing, incoming) {
      if (existing) {
        return {
          ...incoming,
          data: [...existing.data, ...incoming.data]
        };
      }

      return incoming;
    }
  };
};

const apolloClient = new ApolloClient({
  uri: 'http://192.168.29.106:3000/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          seriesListByGenre: paginationMerge(['genre']),
          seriesSearch: paginationMerge(['query'])
        }
      }
    }
  })
});

export const App: FC = codePush(() => {
  const navigationRef = useRef<NavigationContainerRef>();
  const routeNameRef = useRef<String>();

  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <PaperProvider theme={theme}>
        <NavigationContainer
          ref={ref => (navigationRef.current = ref ?? undefined)}
          theme={theme}
          onReady={() => {
            routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
          }}
          onStateChange={async () => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName = navigationRef.current?.getCurrentRoute()
              ?.name;

            if (previousRouteName !== currentRouteName) {
              await analytics().logScreenView({
                screen_name: currentRouteName,
                screen_class: currentRouteName
              });
            }

            routeNameRef.current = currentRouteName;
          }}
        >
          <View style={styles.container}>
            <RootNavigator />
          </View>
        </NavigationContainer>
      </PaperProvider>
    </ApolloProvider>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  }
});
