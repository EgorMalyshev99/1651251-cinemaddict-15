import AbstractView from './abstract.js';
import { MenuItem } from '../const.js';

const createStatsLink = (active) => (
  `<a href="#stats" class="main-navigation__additional ${(active === MenuItem.STATS) ? 'main-navigation__item--active' : ''}" data-menu="${MenuItem.STATS}">Stats</a>`
);

export default class StatsLink extends AbstractView {
  constructor(active) {
    super();
    this._active = active;
    this._menuChangeHandler = this._menuChangeHandler.bind(this);
  }

  getTemplate() {
    return createStatsLink(this._active);
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
