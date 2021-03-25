import React, { FC, memo } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Subheading, Surface } from 'react-native-paper';
import { ISeriesBasic } from '../types';

export type SeriesItemProps = {
  series: ISeriesBasic;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  image?: {
    height: number;
    width: number;
  };
};

const defaultImageSize = {
  height: 180,
  width: 150
};

const SeriesItemBase: FC<SeriesItemProps> = ({
  series,
  style,
  image,
  onPress
}) => {
  const imageWidth = image?.width || defaultImageSize.width;
  const imageHeight = image?.height || defaultImageSize.height;

  return (
    <TouchableOpacity style={style} activeOpacity={0.7} onPress={onPress}>
      <Surface
        style={[
          styles.content,
          {
            width: imageWidth
          }
        ]}
      >
        <Image
          source={{ uri: series.thumbnail }}
          style={[
            styles.image,
            {
              width: imageWidth,
              height: imageHeight
            }
          ]}
          width={imageWidth}
          height={imageHeight}
          resizeMode="cover"
        />
        <View style={styles.details}>
          <Subheading numberOfLines={1}>{series.name}</Subheading>
        </View>
      </Surface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  content: {
    borderRadius: 8
  },
  image: {
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8
  },
  details: {
    paddingVertical: 8,
    paddingHorizontal: 10
  }
});

export const SeriesItem = memo(SeriesItemBase);
