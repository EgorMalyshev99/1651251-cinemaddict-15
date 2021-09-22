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
  listTitles,
  SortType
} from '../const.js';
import {
  sortFilmDate,
  sortFilmRating
} from '../utils/film.js';

const FILMS_COUNT_PER_STEP = 5;

export default class MovieList {
  constructor(boardContainer, filmsModel) {
    this._filmsModel = filmsModel;
    this._boardContainer = boardContainer;
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._filmPresenter = new Map;
    this._currentSortType = SortType.DEFAULT;

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
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._renderBoard();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getFilms().slice().sort(sortFilmDate);
      case SortType.RATING:
        return this._filmsModel.getFilms().slice().sort(sortFilmRating);
    }

    return this._filmsModel.getFilms();
  }

  _renderMenu() {
    render(this._boardContainer, new MenuView(this._getFilms()), RenderPoints.AFTERBEGIN); // Отрисовка меню
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => {
      presenter.resetView();
    });
  }

  _handleFilmChange(updatedFilm) {
    this._filmPresenter.get(updatedFilm.id).init(updatedFilm);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsList();
    this._renderFilmsList();
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilmsListContainer() {
    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._filmsListComponent);
    render(this._filmsListComponent, this._filmsListContainerComponent);
  }

  _renderFilm(film) {
    const filmPresenter = new FilmPresenter(this._filmsListContainerComponent, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter.set(film.id, filmPresenter);
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(film));
  }

  _renderFilmsList() {
    const filmsCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmsCount, FILMS_COUNT_PER_STEP));

    this._renderFilmsListContainer();
    this._renderFilms(films);

    if (filmsCount > FILMS_COUNT_PER_STEP) {
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
    render(this._boardComponent, this._noFilmsComponent, RenderPoints.BEFOREEND);
  }

  _handleMoreButtonClick() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmsCount);

    this._renderFilms(films);
    this._renderedFilmsCount = newRenderedFilmsCount;

    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._moreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._filmsListComponent, this._moreButtonComponent);
    this._moreButtonComponent.setClickHandler(this._handleMoreButtonClick);
  }

  _renderBoard() {
    const filmsCount = this._getFilms().length;

    this._renderMenu();
    this._renderSort();

    if (filmsCount === 0) {
      this._renderNoFilms();
    }

    this._renderFilmsList();
  }
}
