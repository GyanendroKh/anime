import { ParamListBase, NavigationProp } from '@react-navigation/native';

export const getParentRouteName = <T extends ParamListBase, L extends keyof T>(
  navigation: NavigationProp<T, L>
) => {
  const state = navigation.dangerouslyGetState();
  return state.routes[state.index - 1].name;
};
