import AbstractView from './abstract';

const createFilmsListContainer = () => ('<div class="films-list__container"></div>');

export default class FilmsListContainer extends AbstractView {
  getTemplate() {
    return createFilmsListContainer();
  }
}
