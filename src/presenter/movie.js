import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import {
  isEscEvent
} from '../utils/check-events.js';
import {
  remove,
  render,
  replace
} from '../utils/render';

export default class Movie {
  constructor(filmsListContainer) {
    this._filmsListContainer = filmsListContainer;
    this._body = document.querySelector('body');

    this._filmComponent = null;
    this._popupComponent = null;

    this._handleShowPopup = this._handleShowPopup.bind(this);
    this._handleClosePopup = this._handleClosePopup.bind(this);
    this._handeleEscPopup = this._handeleEscPopup.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._popupComponent;

    this._filmComponent = new FilmCardView(film);
    this._popupComponent = new PopupView(film);

    if (prevFilmComponent === null || prevPopupComponent === null) {
      this._renderFilm();
      return;
    }

    if (this._filmsListContainer.getElement().contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._filmsListContainer.getElement().contains(prevPopupComponent.getElement())) {
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._popupComponent);
  }

  _handleShowPopup() {
    this._popupComponent.getElement().classList.remove('visually-hidden');
    this._body.classList.add('hide-overflow');

    this._popupComponent.setClosePopupHandler(this._handleClosePopup);
    document.addEventListener('keydown', this._handleClosePopup);
  }

  _handleClosePopup() {
    this._popupComponent.getElement().classList.add('visually-hidden');
    this._body.classList.remove('hide-overflow');
    this._popupComponent.getElement().querySelector('.film-details__close-btn').removeEventListener('click', this._handleClosePopup);
  }

  _handeleEscPopup(event) {
    if (isEscEvent(event)) {
      this._popupComponent.classList.add('visually-hidden');
      this._body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this._handleClosePopup);
    }
  }

  _renderPopup() {
    render(this._body, this._popupComponent);

    this._filmComponent.setShowPopupHandler(this._handleShowPopup);
  }

  _renderFilm() {
    render(this._filmsListContainer, this._filmComponent);

    this._renderPopup();
  }
}
