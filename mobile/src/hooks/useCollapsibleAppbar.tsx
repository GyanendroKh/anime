import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';

export type DiffClampCtx = {
  value: number;
  prevValue: number;
};

const minScrollDefault = 100;

export const useCollapsibleAppbar = ({
  appBarHeight,
  minScroll,
  scrollHandler
}: {
  appBarHeight: number;
  minScroll?: number;
  scrollHandler?: Animated.ScrollHandlers<Record<string, unknown>>;
}) => {
  const translateY = useSharedValue(0);

  const scrollHandlerBase = useAnimatedScrollHandler<DiffClampCtx>({
    onBeginDrag: (e, ctx) => {
      ctx.value = ctx.prevValue = 0;

      if (scrollHandler?.onBeginDrag !== undefined) {
        scrollHandler.onBeginDrag(e, ctx);
      }
    },
    onScroll: (e, ctx) => {
      const clampedScrollY = interpolate(
        e.contentOffset.y,
        [minScroll || minScrollDefault, minScroll || minScrollDefault + 1],
        [0, 1],
        { extrapolateLeft: Extrapolate.CLAMP }
      );

      const minusScrollY = clampedScrollY * -1;

      // Custom diffClamp Implementation.
      const value = minusScrollY;
      const diff = value - ctx.prevValue;
      ctx.prevValue = value;
      ctx.value = Math.min(Math.max(ctx.value + diff, -appBarHeight), 0);

      translateY.value = ctx.value;

      if (scrollHandler?.onScroll) {
        scrollHandler.onScroll(e, ctx);
      }
    }
  });

  const appBarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }]
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      marginTop: translateY.value
    };
  });

  return {
    translateY,
    scrollHandler: scrollHandlerBase,
    appBarStyle,
    contentStyle
  };
};
