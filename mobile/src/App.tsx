import 'react-native-gesture-handler';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
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

export const App: FC = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <View style={styles.container}>
            <RootNavigator />
          </View>
        </NavigationContainer>
      </PaperProvider>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  }
});
