import FilterView from '../view/filter.js';
import {
  remove,
  render,
  replace
} from '../utils/render.js';
import {
  filter
} from '../utils/filter.js';
import {
  FilterType,
  UpdateType
} from '../const.js';
import { RenderPoints } from '../utils/render.js';

export default class Filter {
  constructor(filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init(currentScreen) {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;
    this._currentScreen = currentScreen;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter(), this._currentScreen);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      this._filterComponent.setMenuClickHandler(this._menuClickItem);
      render(this._filterContainer, this._filterComponent, RenderPoints.AFTERBEGIN);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  destroy() {
    remove(this._filterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  setMenuClickHandler(callback) {
    this._menuClick = callback;
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [{
      type: FilterType.ALL,
      name: 'All movies',
      count: filter[FilterType.ALL](films).length,
    },
    {
      type: FilterType.WATCHLIST,
      name: 'Watchlist',
      count: filter[FilterType.WATCHLIST](films).length,
    },
    {
      type: FilterType.HISTORY,
      name: 'History',
      count: filter[FilterType.HISTORY](films).length,
    },
    {
      type: FilterType.FAVORITES,
      name: 'Favorites',
      count: filter[FilterType.FAVORITES](films).length,
    },
    ];
  }
}
