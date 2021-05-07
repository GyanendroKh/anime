import { IEntity } from 'gogoanime-api';
import { SeriesPlayProps } from '../pages';

export type SeriesParamList = {
  Series: {
    series: IEntity;
  };
  SeriesPlay: SeriesPlayProps;
};
