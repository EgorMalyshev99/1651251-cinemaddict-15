import {
  createElement
} from '../utils/create-component';

const createMoreBtn = () => ('<button class="films-list__show-more">Show more</button>');

export default class MoreBtn {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMoreBtn();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
