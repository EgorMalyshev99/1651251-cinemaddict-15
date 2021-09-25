import AbstractView from './abstract';
import {
  SortType
} from '../const';

const createSort = (currentSortType) => (
  `<ul class="sort">
    <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type=${SortType.DEFAULT}>Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.DATE ? 'sort__button--active' : ''}" data-sort-type=${SortType.DATE}>Sort by date</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.RATING ? 'sort__button--active' : ''}" data-sort-type=${SortType.RATING}>Sort by rating</a></li>
  </ul>`
);

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSort(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    const allSortButtons = this.getElement().querySelectorAll('.sort__button');
    allSortButtons.forEach((btn) => {
      if (btn.classList.contains('sort__button--active')) {
        btn.classList.remove('sort__button--active');
      }
    });

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
    evt.target.classList.add('sort__button--active');
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
