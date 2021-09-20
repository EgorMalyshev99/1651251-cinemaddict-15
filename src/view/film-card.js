import AbstractView from './abstract.js';

const createFilmCard = (film) => {
  const {
    name,
    rating,
    releaseDate,
    duration,
    genre,
    poster,
    description,
    commentsCount,
  } = film;

  let filmDescription = description;

  filmDescription.length >= 140 ? filmDescription = `${description.slice(0, 140)  }...` : {};

  let additionalLetter = '';
  film.commentsCount !== 1 ? additionalLetter = 's' : {};

  const isActiveClass = (status) => status === true ? 'film-card__controls-item--active' : '';

  return `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate.year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${commentsCount} comment${additionalLetter}</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${isActiveClass(film.status.isWatchList)}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${isActiveClass(film.status.isHistory)}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${isActiveClass(film.status.isFavorite)}" type="button">Mark as favorite</button>
      </div>
    </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._detailsClickHandler = this._detailsClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCard(this._film);
  }

  _detailsClickHandler(event) {
    event.preventDefault();
    this._callback.detailsClick();
  }

  _watchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchListClick();
  }

  _historyClickHandler(evt) {
    evt.preventDefault();
    this._callback.historyClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchListClickHandler);
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._historyClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setShowPopupHandler(callback) {
    this._callback.detailsClick = callback;
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._detailsClickHandler);
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._detailsClickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._detailsClickHandler);
  }
}
