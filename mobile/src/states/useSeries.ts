import create, { State } from 'zustand';
import { getData } from '../data';
import { ISeriesBasic } from '../types';

export interface ISeriesState<T> extends State {
  animes: T[];
  setAnimes: (animes: T[]) => void;
  fetch: () => Promise<void>;
  isLoading: boolean;
  error: undefined | unknown;
}

export const useTopAnime = create<ISeriesState<ISeriesBasic>>(set => ({
  animes: [],
  setAnimes: (animes: ISeriesBasic[]) => set({ animes }),
  fetch: async () => {
    set({ isLoading: true });
    await (async () => {
      const data = getData();
      const start = Math.floor(Math.random() * data.length);

      const animes = data.slice(start, Math.min(start + 5, data.length));

      set({
        animes: animes.map(a => ({
          id: a.movieId,
          name: a.name,
          thumbnail: a.thumbnail
        }))
      });
    })();
    set({ isLoading: false });
  },
  isLoading: false,
  error: undefined
}));

export const useTrendingAnime = create<ISeriesState<ISeriesBasic>>(set => ({
  animes: [],
  setAnimes: (animes: ISeriesBasic[]) => set({ animes }),
  fetch: async () => {
    set({ isLoading: true });
    await (async () => {
      const data = getData();
      const start = Math.floor(Math.random() * data.length);

      const animes = data.slice(start, Math.min(start + 5, data.length));

      set({
        animes: animes.map(a => ({
          id: a.movieId,
          name: a.name,
          thumbnail: a.thumbnail
        }))
      });
    })();
    set({ isLoading: false });
  },
  isLoading: false,
  error: undefined
}));

export const useMyAnimeCollection = create<ISeriesState<ISeriesBasic>>(set => ({
  animes: [],
  setAnimes: (animes: ISeriesBasic[]) => set({ animes }),
  fetch: async () => {
    set({ isLoading: true });
    await (async () => {
      const data = getData();
      const start = Math.floor(Math.random() * data.length);

      const animes = data.slice(start, Math.min(start + 5, data.length));

      set({
        animes: animes.map(a => ({
          id: a.movieId,
          name: a.name,
          thumbnail: a.thumbnail
        }))
      });
    })();
    set({ isLoading: false });
  },
  isLoading: false,
  error: undefined
}));
