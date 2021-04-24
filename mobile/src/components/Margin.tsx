import React, { FC } from 'react';
import { View } from 'react-native';

export type MarginProps = {
  margin?: number;
  marginVertical?: number;
  marginHorizontal?: number;
  marginLeft?: number;
  marginRight?: number;
};

export const Margin: FC<MarginProps> = ({ children, ...props }) => {
  return <View style={{ ...props }}>{children}</View>;
};
