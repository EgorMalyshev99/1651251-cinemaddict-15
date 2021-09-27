import FilmsView from '../view/lists-container.js';
import FilmsListView from '../view/films-list.js';
import NoFilmsView from '../view/no-films.js';
import LoadingView from '../view/loading.js';
import FilmsListContainerView from '../view/films-list-container.js';
import FilmPresenter from './movie.js';
import SortView from '../view/sort.js';
import LoadMoreButtonView from '../view/more-button.js';
import FooterStatsView from '../view/films-count.js';
import {
  render,
  remove
} from '../utils/render.js';
import {
  listTitles,
  SortType,
  UpdateType,
  UserAction,
  FilterType
} from '../const.js';
import {
  sortFilmDate,
  sortFilmRating
} from '../utils/film.js';
import {
  filter
} from '../utils/filter.js';
import {
  footerStats
} from '../main.js';

const FILMS_COUNT_PER_STEP = 5;

export default class MovieList {
  constructor(boardContainer, filmsModel, filterModel, api) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._boardContainer = boardContainer;
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._filmPresenter = new Map;
    this._filterType = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._api = api;

    this._boardComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView(listTitles.ALL);
    this._noFilmsComponent = null;
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._sortComponent = null;
    this._moreButtonComponent = null;
    this._loadingComponent = new LoadingView();
    this._footerStatsComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleMoreButtonClick = this._handleMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._renderBoard();
  }

  destroy() {
    this._clearBoard({
      resetRenderedFilmsCount: true,
      resetSortType: true,
    });

    remove(this._boardComponent);
    remove(this._filmsListComponent);
    remove(this._filmsListContainerComponent);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getFilms() {
    this._filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[this._filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortFilmDate);
      case SortType.RATING:
        return filtredFilms.sort(sortFilmRating);
    }

    return filtredFilms;
  }

  _getComments() {
    return this._filmsModel.getComments();
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => {
      presenter.resetView();
    });
  }

  _handleViewAction(actionType, updateType, updateFilm, updateComment, scrollPosition = 0) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(updateFilm).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
      case UserAction.ADD_COMMENT:
        this._filmPresenter.get(updateFilm[0].id).setSavingComment();
        if(this._filmRatedPresenter.has(updateFilm[0].id)) {
          this._filmRatedPresenter.get(updateFilm[0].id).setSavingComment();
        }
        if(this._filmCommentedPresenter.has(updateFilm[0].id)) {
          this._filmCommentedPresenter.get(updateFilm[0].id).setSavingComment();
        }
        this._api.addComment(updateFilm, updateComment).then((response) => {
          this._cardsModel.addComment(updateType, updateFilm, response);
          this._setPopupScroll(updateFilm, scrollPosition);
        })
          .catch(() => {
            this._filmPresenter.get(updateFilm[0].id).setCancelAddComment();
            this._setPopupScroll(updateFilm, scrollPosition);
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._filmPresenter.get(updateFilm[0].id).setDeletingComment();
        this._api.deleteComment(updateComment).then(() => {
          this._cardsModel.deleteComment(updateType, updateFilm, updateComment);
          this._setPopupScroll(updateFilm, scrollPosition);
        })
          .catch(() => {
            this._filmPresenter.get(updateFilm[0].id).setCancelDeleteComment();
            this._setPopupScroll(updateFilm, scrollPosition);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    const comments = this._getComments();
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({
          resetRenderedFilmsCount: true,
          resetSortType: true,
        });
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
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

  _setPopupScroll(updateFilm, scrollPosition) {
    this._filmPresenter.get(updateFilm[0].id).setPopupScrollPosition(scrollPosition);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._boardContainer, this._sortComponent);
  }

  _renderLoading() {
    render(this._boardContainer, this._loadingComponent);
  }

  _renderFilm(film) {
    const comments = this._getComments();
    const filmPresenter = new FilmPresenter(this._filmsListContainerComponent, comments, this._handleViewAction, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter.set(film.id, filmPresenter);
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(film));
  }

  _renderFilmsList() {
    const filmsCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmsCount, FILMS_COUNT_PER_STEP));

    render(this._boardComponent, this._filmsListComponent);
    render(this._filmsListComponent, this._filmsListContainerComponent);
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
    this._noFilmsComponent = new NoFilmsView(this._filterType);
    render(this._boardComponent, this._noFilmsComponent);
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
    remove(this._moreButtonComponent);
    remove(this._filmsListComponent);
    remove(this._filmsListContainerComponent);
    remove(this._footerStatsComponent);

    if (this._noFilmsComponent) {
      remove(this._noFilmsComponent);
    }

    if (resetRenderedFilmsCount) {
      this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getFilms();
    const filmsCount = films.length;

    if (filmsCount === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();
    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._filmsListComponent);
    render(this._filmsListComponent, this._filmsListContainerComponent);
    this._renderFilms(films.slice(0, Math.min(filmsCount, this._renderedFilmsCount)));

    if (filmsCount > this._renderedFilmsCount) {
      this._renderLoadMoreButton();
    }

    this._footerStatsComponent = new FooterStatsView(films.length);
    render(footerStats, this._footerStatsComponent);
  }
}
