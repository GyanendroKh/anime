import { useRef } from 'react';
import { GoGoAnime } from 'gogoanime-api';

export const useGoGoAnime = () => {
  const gogoAnime = useRef(new GoGoAnime());

  return gogoAnime.current;
};
