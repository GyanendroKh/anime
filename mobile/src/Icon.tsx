import React from 'react';
import { IconProps } from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default Icon;

export const toIcon = (name: string, props?: Partial<IconProps>) => {
  return <Icon {...props} name={name} />;
};
