import 'react-native-gesture-handler';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Provider as PaperProvider,
  Title,
  DarkTheme as PaperDarkTheme
} from 'react-native-paper';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import merge from 'deepmerge';

const theme = merge(NavigationDarkTheme, PaperDarkTheme);

export const App: FC = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <View style={styles.container}>
          <Title>Arch Anime</Title>
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  }
});
