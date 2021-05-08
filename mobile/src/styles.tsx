import { StyleSheet } from 'react-native';
import { theme } from './constants';

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  },
  flexGrow1: {
    flexGrow: 1
  },
  fill: {
    height: '100%',
    width: '100%'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  height10: {
    height: 10
  },
  width10: {
    width: 10
  },
  displayFlex: {
    display: 'flex'
  },
  displayNone: {
    display: 'none'
  },
  flexRow: {
    flexDirection: 'row'
  },
  absolute0: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  alignSelfCenter: {
    alignSelf: 'center'
  },
  paginationWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderTopColor: theme.colors.backdrop,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
    paddingBottom: 5
  },
  paginationItem: {
    paddingHorizontal: 35,
    paddingVertical: 10
  },
  paginationItemActive: {
    borderTopColor: theme.colors.primary,
    borderTopWidth: 2
  }
});

export default styles;
