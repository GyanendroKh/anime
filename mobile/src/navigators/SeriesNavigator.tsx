import { SeriesPlayProps } from '../pages';
import { ISeriesBasic } from '../types';

export type SeriesParamList = {
  Series: {
    series: ISeriesBasic;
  };
  SeriesPlay: SeriesPlayProps;
};
