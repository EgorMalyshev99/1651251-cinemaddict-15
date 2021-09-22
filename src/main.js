import {
  generateFilm
} from './mock/film.js';
import FilmsModel from './model/films.js';
import {
  RenderPoints,
  render
} from './utils/render.js';

import StatsView from './view/stats.js';
import FilmsPresenter from './presenter/movie-list.js';
import FooterStatsView from './view/films-count.js';

const NUMBER_OF_FILMS = 20;

const films = new Array(NUMBER_OF_FILMS).fill().map(generateFilm);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footerStats = document.querySelector('.footer__statistics');

const {
  AFTERBEGIN,
} = RenderPoints;

render(header, new StatsView());

const filmsPresenter = new FilmsPresenter(main, filmsModel);
filmsPresenter.init();

render(footerStats, new FooterStatsView(films.length), AFTERBEGIN);
