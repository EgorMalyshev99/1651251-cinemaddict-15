import {
  FilterType,
  MenuItem
} from '../const';
import AbstractView from './abstract';

const createFilterItemTemplate = (filter, currentFilterType) => {
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

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<div class="main-navigation__items">
            ${filterItemsTemplate}
          </div>`;
};

export default class SiteFilter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  toggleActiveClass(status) {
    if (status === MenuItem.STATS) {
      this.getElement().querySelectorAll('.main-navigation__item').forEach((item, index) => {
        item.classList.remove('main-navigation__item--active');
        if (index !== 0) {
          item.classList.add('disabled');
        }
      });
      return;
    }
    this.getElement().querySelectorAll('.main-navigation__item').forEach((item, index) => {
      item.classList.remove('disabled');
      if (index === 0) {
        item.classList.add('main-navigation__item--active');
      }
    });
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();

    this._callback.filterTypeChange(evt.target.dataset.filter);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menu);
  }

  restoreHandlers() {
    this.setFilterTypeChangeHandler(this.callback.filterTypeChange);
    this.setMenuClickHandler(this.callback.menuClick);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelectorAll('.main-navigation__item').forEach((item) => {
      item.addEventListener('click', this._filterTypeChangeHandler);
    });
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().querySelectorAll('.main-navigation__item').forEach((item) => {
      item.addEventListener('click', this._menuClickHandler);
    });
  }
}
