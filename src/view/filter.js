import {
  FilterType,
  MenuItem
} from '../const';
import AbstractView from './abstract';

const createFilterItemTemplate = (filter, currentFilterType, currentScreen) => {
  const {
    type,
    name,
    count,
  } = filter;

  const countFilms = `&nbsp;<span class="main-navigation__item-count" data-filter="${type}" data-menu="${false}">${count}</span>`;

  const isAllLink = () => type === FilterType.ALL;

  return (
    `<a href="#${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter="${type}" data-menu="${isAllLink() ? MenuItem.FILMS : false}">${name}${!isAllLink() ? countFilms : ''}</a>`
  );
};

const createFilterTemplate = (filterItems, currentFilterType, currentScreen) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType, currentScreen))
    .join('');

  return `<div class="main-navigation__items">
            ${filterItemsTemplate}
          </div>`;
};

export default class SiteFilter extends AbstractView {
  constructor(filters, currentFilterType, currentScreen) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._currentScreen = currentScreen;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter, this._currentScreen);
  }

  restoreHandlers() {
    this.getElement()
      .querySelectorAll('.main-navigation__item')
      .forEach((item) => {
        if (item.dataset.menu) {
          if (this._activeScreen === MenuItem.MOVIES) {
            item.addEventListener('click', this._filterTypeChangeHandler);
            return;
          }
          item.addEventListener('click', this._menuClickHandler);
          return;
        }
        item.addEventListener('click', this._filterTypeChangeHandler);
      });
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();

    this._callback.filterTypeChange(evt.target.dataset.value);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menu);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelectorAll('.main-navigation__item').forEach((item) => {
      if (item.dataset.menu) {
        if (this._activeScreen === MenuItem.MOVIES) {
          item.addEventListener('click', this._filterTypeChangeHandler);
          return;
        }
        item.addEventListener('click', this._menuClickHandler);
        return;
      }
      item.addEventListener('click', this._filterTypeChangeHandler);
    });
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }
}
