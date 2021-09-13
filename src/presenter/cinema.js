import FilmsView from '../view/lists-container.js';
import FilmsListView from '../view/films-list.js';
import NoFilmsView from '../view/no-films.js';
import FilmsListContainerView from '../view/films-list-container.js';
import FilmPresenter from './film.js';
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
    const filmPresenter = new FilmPresenter(this._filmsListContainerComponent);

    filmPresenter.init(film);
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
