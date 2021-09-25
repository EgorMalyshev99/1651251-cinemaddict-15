import {
  FilterType
} from '../const';
import AbstractView from './abstract';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {
    type,
    name,
    count,
  } = filter;

  let countFilms = '';

  if (type !== FilterType.ALL) {
    countFilms = `&nbsp;<span class="main-navigation__item-count" data-filter="${type}">${count}</span>`;
  }

  return (
    `<a href="#${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter="${type}">${name}${countFilms}</a>`
  );
};

const createMainFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              ${filterItemsTemplate}
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMainFilterTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();

    this._callback.filterTypeChange(evt.target.dataset.filter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelectorAll('.main-navigation__item').forEach((item) => {
      item.addEventListener('click', this._filterTypeChangeHandler);
    });
    // this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
