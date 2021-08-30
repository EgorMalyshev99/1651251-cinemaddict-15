import {
  createElement
} from '../utils/create-component';

const createFilmsCount = (count) => `<p>${count} movies inside</p>`;

export default class FooterStats {
  constructor(numberOfFilms) {
    this._numberOfFilms = numberOfFilms;
    this._element = null;
  }

  getTemplate() {
    return createFilmsCount(this._numberOfFilms);
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
