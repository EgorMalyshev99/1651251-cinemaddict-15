import {
  FilterType
} from '../const';

export const filter = {
  [FilterType.ALL]: (films) => films.filter((film) => film),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.status.isWatchList),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.status.isHistory),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.status.isFavorite),
};
