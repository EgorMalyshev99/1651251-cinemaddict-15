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
  SortType,
  UpdateType,
  UserAction
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
    this._menuComponent = new MenuView();
    this._filmsListComponent = new FilmsListView(listTitles.ALL);
    this._noFilmsComponent = new NoFilmsView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    // this._sortComponent = new SortView();
    this._sortComponent = null;
    // this._moreButtonComponent = new LoadMoreButtonView();
    this._moreButtonComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleMoreButtonClick = this._handleMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
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

  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._filmsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._filmsModel.deleteComment(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this._clearBoard();
        this._renderFilmsList();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this._clearBoard({
          resetRenderedFilmsCount: true,
          resetSortType: true,
        });
        this._renderBoard();
        break;
    }
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
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView();
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._boardContainer, this._sortComponent);
  }

  _renderFilmsListContainer() {
    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._filmsListComponent);
    render(this._filmsListComponent, this._filmsListContainerComponent);
  }

  _renderFilm(film) {
    const filmPresenter = new FilmPresenter(this._filmsListContainerComponent, this._handleViewAction, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter.set(film.id, filmPresenter);
  }

  _renderFilms(films) {
    this._renderFilmsListContainer();
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
    if (this._moreButtonComponent !== null) {
      this._moreButtonComponent = null;
    }

    this._moreButtonComponent = new LoadMoreButtonView();
    this._moreButtonComponent.setClickHandler(this._handleMoreButtonClick);

    render(this._filmsListComponent, this._moreButtonComponent);
  }

  _clearBoard({
    resetRenderedFilmsCount = false,
    resetSortType = false,
  } = {}) {
    const filmsCount = this._getFilms().length;

    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();

    remove(this._sortComponent);
    remove(this._noFilmsComponent);
    remove(this._moreButtonComponent);

    if (resetRenderedFilmsCount) {
      this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    const films = this._getFilms();
    const filmsCount = films.length;

    this._renderMenu();
    this._renderSort();

    if (filmsCount === 0) {
      this._renderNoFilms();
    }

    this._renderFilms(films.slice(0, Math.min(filmsCount, this._renderedFilmsCount)));
    // this._renderFilmsList();

    if (filmsCount > this._renderedFilmsCount) {
      this._renderLoadMoreButton();
    }
  }
}
