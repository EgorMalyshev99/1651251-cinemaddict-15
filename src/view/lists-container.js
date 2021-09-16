import AbstractView from './abstract';

const createFilmsList = () => ('<section class="films"></section>');

export default class FilmsList extends AbstractView {
  getTemplate() {
    return createFilmsList();
  }
}
