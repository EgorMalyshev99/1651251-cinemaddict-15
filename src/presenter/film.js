import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import CommentView from '../view/comment.js';
import {
  isEscEvent
} from '../utils/check-events.js';
import {
  render
} from '../utils/render';

export default class Film {
  constructor(filmsListContainer) {
    this._filmsListContainer = filmsListContainer;
    this._body = document.querySelector('body');

    this._filmComponent = null;
    this._popupComponent = null;

    this.handleShowPopup = this._handleShowPopup.bind(this);
  }

  init(film) {
    this._filmComponent = new FilmCardView(film);
    this._popupComponent = new PopupView(film);
    this._commentsComponent = new CommentView(film.comments);

    this._renderFilm();
  }

  _handleShowPopup() {
    this._popupComponent.classList.remove('visually-hidden');
    this._body.classList.add('hide-overflow');

    // Отрисовка комментариев
    if (!this._popupComponent.querySelector('.film-details__comments-list').hasChildNodes()) {
      // commentss
    }
    this._popupComponent.setClosePopupHandler(this._handleClosePopup);
    document.addEventListener('keydown', this._handleClosePopup);
  }

  _handleClosePopup() {
    this._popupComponent.classList.add('visually-hidden');
    this._body.classList.remove('hide-overflow');
    this._popupComponent.querySelector('.film-details__close-btn').removeEventListener('click', this._handleClosePopup);
  }

  _handeleEscPopup(event) {
    if (isEscEvent(event)) {
      this._popupComponent.classList.add('visually-hidden');
      this._body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this._handleClosePopup);
    }
  }

  _renderPopup() {
    // Создаем попап карточки
    render(this._body, this._popupComponent);

    // Добавляем листенеры
    this._filmComponent.setShowPopupHandler(this._handleShowPopup);
  }

  _renderFilm() {
    // Создаем карточку
    render(this._filmsListContainer, this._filmComponent);

    // Создаем попап
    this._renderPopup();
  }
}
