import FilmsView from '../view/lists-container.js';
import FilmsListView from '../view/films-list.js';
import NoFilmsView from '../view/no-films.js';
import FilmsListContainerView from '../view/films-list-container.js';
// import FilmPresenter from './film.js';
import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import CommentView from '../view/comment.js';
import SortView from '../view/sort.js';
import MenuView from '../view/menu.js';
import LoadMoreButtonView from '../view/more-button.js';
import {
  render,
  remove,
  RenderPoints
} from '../utils/render.js';
import {
  listTitles
} from '../data.js';
import {
  isEscEvent
} from '../utils/check-events.js';

const FILMS_COUNT_PER_STEP = 5;

export default class Films {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;

    this._boardComponent = new FilmsView();
    this._sortComponent = new SortView();
    this._menuComponent = new MenuView();
    this._filmsListComponent = new FilmsListView(listTitles.ALL);
    this._noFilmsComponent = new NoFilmsView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._filmCardComponent = new FilmCardView();
    this._popupComponent = new PopupView();
    this._commentComponent = new CommentView();
    this._moreButtonComponent = new LoadMoreButtonView();

    // this._handleFilmChange = this._handleFilmChange.bind(this);
    // this._handleMoreChange = this._handleMoreChange.bind(this);
    this._handleMoreButtonClick = this._handleMoreButtonClick.bind(this);
  }

  init(films) {
    this._films = films.slice();

    this._renderBoard();
  }

  _renderMenu() {
    render(this._boardContainer, new MenuView(this._films), RenderPoints.AFTERBEGIN); // Отрисовка меню
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent);
  }

  _renderFilmsListContainer() {
    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._filmsListComponent, RenderPoints.AFTERBEGIN);
    render(this._filmsListComponent, this._filmsListContainerComponent);
  }

  _renderFilm(film) {
    const body = document.querySelector('body');
    // Создаем карточку
    const card = new FilmCardView(film);
    render(this._filmsListContainerComponent, card);

    // Создаем попап карточки
    const popupComponent = new PopupView(film);
    render(body, popupComponent);

    const showPopupHandler = () => {
      popupComponent.getElement().classList.remove('visually-hidden');
      body.classList.add('hide-overflow');

      // Отрисовка комментариев
      if (!popupComponent.getElement().querySelector('.film-details__comments-list').hasChildNodes()) {
        film.comments.forEach((comment) => {
          const singleComment = new CommentView(comment);
          render(popupComponent.getElement().querySelector('.film-details__comments-list'), singleComment);
        });
      }
      const closePopupHandler = () => {
        popupComponent.getElement().classList.add('visually-hidden');
        body.classList.remove('hide-overflow');
        popupComponent.getElement().querySelector('.film-details__close-btn').removeEventListener('click', closePopupHandler);
      };
      const escPopupHandler = (event) => {
        if (isEscEvent(event)) {
          popupComponent.getElement().classList.add('visually-hidden');
          body.classList.remove('hide-overflow');
          document.removeEventListener('keydown', escPopupHandler);
        }
      };
      popupComponent.setClosePopupHandler(closePopupHandler);
      document.addEventListener('keydown', escPopupHandler);
    };

    // Добавляем листенеры
    card.setShowPopupHandler(showPopupHandler);
  }

  _renderFilms(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => {
        this._renderFilm(film);
      });
  }

  _renderFilmsList() {
    this._renderFilmsListContainer();
    this._renderFilms(0, Math.min(this._films.length, this._renderedFilmsCount));

    if (this._films.length > FILMS_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderNoFilms() {
    // render(this._boardComponent, this._noFilmsComponent, RenderPoints.BEFOREEND);
  }

  _handleMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    this._renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._moreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._filmsListComponent, this._moreButtonComponent); // Добавляем кнопку "Показать еще" в главный список
    this._moreButtonComponent.setClickHandler(this._handleMoreButtonClick);
  }

  _renderBoard() {
    if (this._films.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort(); // Сортировка
    this._renderMenu(); // Меню

    this._renderFilmsList();
  }
}
