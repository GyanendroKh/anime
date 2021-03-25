import { getData } from '../data';

export const getSeriesInfo = (id: string) => {
  const data = getData();
  const anime = data.find(d => d.movieId === id);

  return anime;
};
