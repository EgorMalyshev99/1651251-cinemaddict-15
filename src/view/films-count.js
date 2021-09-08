import Abstract from './abstract.js';

const createFilmsCount = (count) => (`<p>${count} movies inside</p>`);

export default class FooterStats extends Abstract {
  constructor(numberOfFilms) {
    super();
    this._numberOfFilms = numberOfFilms;
  }

  getTemplate() {
    return createFilmsCount(this._numberOfFilms);
  }
}
