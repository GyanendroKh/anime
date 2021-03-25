import 'react-native-gesture-handler';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './navigators';
import { theme } from './constants';

export const App: FC = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <View style={styles.container}>
          <RootNavigator />
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
