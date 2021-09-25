import {
  generateFilm
} from './mock/film.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import {
  RenderPoints,
  render
} from './utils/render.js';
import FilterPresenter from './presenter/filter.js';
import StatsView from './view/stats.js';
import FilmsPresenter from './presenter/movie-list.js';
import FooterStatsView from './view/films-count.js';

const NUMBER_OF_FILMS = 12;
const {
  AFTERBEGIN,
} = RenderPoints;

const films = new Array(NUMBER_OF_FILMS).fill().map(generateFilm);
// console.log(films);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footerStats = document.querySelector('.footer__statistics');

render(header, new StatsView());

const filmsPresenter = new FilmsPresenter(main, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(main, filterModel, filmsModel);

filterPresenter.init();
filmsPresenter.init();

render(footerStats, new FooterStatsView(films.length), AFTERBEGIN);
