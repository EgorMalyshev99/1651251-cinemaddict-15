import FilmsView from '../view/lists-container.js';
import FilmsListView from '../view/films-list.js';
import NoFilmsView from '../view/no-films.js';
import FilmsListContainerView from '../view/films-list-container.js';
import FilmPresenter from './movie.js';
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
  updateItem
} from '../utils/common.js';

const FILMS_COUNT_PER_STEP = 5;

export default class MovieList {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._filmPresenter = new Map;

    this._boardComponent = new FilmsView();
    this._sortComponent = new SortView();
    this._menuComponent = new MenuView();
    this._filmsListComponent = new FilmsListView(listTitles.ALL);
    this._noFilmsComponent = new NoFilmsView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._moreButtonComponent = new LoadMoreButtonView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleMoreButtonClick = this._handleMoreButtonClick.bind(this);
  }

  init(films) {
    this._boardFilms = films.slice();

    this._renderBoard();
  }

  _renderMenu() {
    render(this._boardContainer, new MenuView(this._boardFilms), RenderPoints.AFTERBEGIN); // Отрисовка меню
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => {
      presenter.resetView();
    });
  }

  _handleFilmChange(updatedFilm) {
    this._boardFilms = updateItem(this._boardFilms, updatedFilm);
    this._filmPresenter.get(updatedFilm.id).init(updatedFilm);
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
    const filmPresenter = new FilmPresenter(this._filmsListContainerComponent, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter.set(film.id, filmPresenter);
  }

  _renderFilms(from, to) {
    this._boardFilms
      .slice(from, to)
      .forEach((film) => {
        this._renderFilm(film);
      });
  }

  _renderFilmsList() {
    this._renderFilmsListContainer();
    this._renderFilms(0, Math.min(this._boardFilms.length, this._renderedFilmsCount));

    if (this._boardFilms.length > FILMS_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _clearFilmsList() {
    this._filmPresenter.forEach((presenter) => {
      presenter.destroy();
    });
    this._filmPresenter.clear();
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    remove(this._moreButtonComponent);
  }

  _renderNoFilms() {
    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._noFilmsComponent, RenderPoints.BEFOREEND);
  }

  _handleMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    this._renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this._renderedFilmsCount >= this._boardFilms.length) {
      remove(this._moreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._filmsListComponent, this._moreButtonComponent); // Добавляем кнопку "Показать еще" в главный список
    this._moreButtonComponent.setClickHandler(this._handleMoreButtonClick);
  }

  _renderBoard() {
    this._renderSort(); // Сортировка
    this._renderMenu(); // Меню

    if (this._boardFilms.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderFilmsList();
  }
}
