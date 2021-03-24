import React, { FC, memo } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Subheading, Surface } from 'react-native-paper';

export type SeriesItemProps = {
  series: {
    title: string;
  };
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

const SeriesItemBase: FC<SeriesItemProps> = ({ style, image, onPress }) => {
  const imageWidth = image?.width || defaultImageSize.width;
  const imageHeight = image?.height || defaultImageSize.height;

  return (
    <TouchableOpacity style={style} activeOpacity={0.7} onPress={onPress}>
      <Surface style={styles.content}>
        <Image
          source={{ uri: 'https://gogocdn.net/cover/chou-kuse-ni-narisou.png' }}
          style={[
            styles.image,
            {
              width: imageWidth,
              height: imageHeight
            }
          ]}
          width={imageWidth}
          height={imageHeight}
        />
        <View style={styles.details}>
          <Subheading numberOfLines={1}>Title</Subheading>
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
