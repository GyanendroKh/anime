import 'react-native-gesture-handler';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './navigators';
import { theme } from './constants';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: 'http://192.168.29.106:3000/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          seriesListByGenre: {
            keyArgs: ['genre'],
            merge(existing, incoming) {
              if (existing) {
                return {
                  ...incoming,
                  data: [...existing.data, ...incoming.data]
                };
              }

              return incoming;
            }
          }
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
