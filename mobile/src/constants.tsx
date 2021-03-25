import merge from 'deepmerge';
import { DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

export const APPBAR_HEIGHT = 50 + 8; // 8 ??
export const theme = merge(NavigationDarkTheme, PaperDarkTheme);
