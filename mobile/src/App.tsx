import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import React, { FC, useEffect, useRef } from 'react';
import { StyleSheet, View, LogBox } from 'react-native';
import codePush from 'react-native-code-push';
import { Provider as PaperProvider } from 'react-native-paper';
import {
  NavigationContainer,
  NavigationContainerRef
} from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import analytics from '@react-native-firebase/analytics';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RootNavigator } from './navigators';
import { theme } from './constants';

const queryClient = new QueryClient();

LogBox.ignoreLogs(['Setting a timer']);

export const App: FC = codePush(() => {
  const navigationRef = useRef<NavigationContainerRef>();
  const routeNameRef = useRef<String>();

  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  }
});
