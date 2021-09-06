import AbstractView from './abstract';

const createFilmsListItem = (heading) => (`<section class="films-list">
    <h2 class="films-list__title visually-hidden">${heading}</h2>
    <div class="films-list__container"></div>
  </section>`);

export default class FilmsListItem extends AbstractView {
  constructor(title) {
    super();
    this._title = title;
  }

  getTemplate() {
    return createFilmsListItem(this._title);
  }
}
