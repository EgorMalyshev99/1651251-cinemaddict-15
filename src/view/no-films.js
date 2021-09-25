import AbstractView from './abstract.js';
import {
  FilterType
} from '../const.js';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createEmptyItem = (filterType) => {
  const noFilmTextValue = NoFilmsTextType[filterType];

  return `<section class="films-list">
            <h2 class="films-list__title">${noFilmTextValue}</h2>
          </section>`;
};

export default class NoFilms extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createEmptyItem(this._data);
  }
}
