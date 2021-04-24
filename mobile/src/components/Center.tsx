import React, { FC } from 'react';
import { View } from 'react-native';
import styles from '../styles';

export type CenterProps = {
  flex?: boolean;
};

export const Center: FC<CenterProps> = ({ children, flex }) => {
  return (
    <View style={[styles.center, flex ? styles.flex1 : {}]}>{children}</View>
  );
};
