import AbstractView from './abstract.js';
import {
  MenuItem
} from '../const.js';

const createStatsLink = () => (
  `<a href="#stats" class="main-navigation__additional" data-menu="${MenuItem.STATS}">Stats</a>`
);

export default class StatsLink extends AbstractView {
  constructor() {
    super();
    this._menuChangeHandler = this._menuChangeHandler.bind(this);
  }

  getTemplate() {
    return createStatsLink(this._active);
  }

  checkActive(status) {
    if (status === MenuItem.FILMS) {
      this.getElement().classList.remove('main-navigation__item--active');
      return;
    }
    this.getElement().classList.add('main-navigation__item--active');
  }

  _menuChangeHandler(evt) {
    evt.preventDefault();
    this._callback.menuChange(evt.target.dataset.menu);
  }

  setMenuClickHandler(callback) {
    this._callback.menuChange = callback;
    this.getElement().addEventListener('click', this._menuChangeHandler);
  }
}
