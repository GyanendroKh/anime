import {
  NavigationProp,
  ParamListBase,
  RouteProp
} from '@react-navigation/native';

export type NavProps<
  L extends ParamListBase,
  T extends keyof L,
  P extends NavigationProp<L, T>
> = {
  navigation: P;
  route: RouteProp<L, T>;
};
