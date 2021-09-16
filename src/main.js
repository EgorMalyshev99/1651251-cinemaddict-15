import {
  generateFilm
} from './mock/film.js';
import {
  RenderPoints,
  render
} from './utils/render.js';

import StatsView from './view/stats.js';
import FilmsPresenter from './presenter/movie-list.js';
import FooterStatsView from './view/films-count.js';

const NUMBER_OF_FILMS = 0;

const films = new Array(NUMBER_OF_FILMS).fill().map(generateFilm);

// const body = document.querySelector('body');
const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footerStats = document.querySelector('.footer__statistics');

const {
  AFTERBEGIN,
} = RenderPoints;

render(header, new StatsView()); // Имя профиля

// Отрисовка всех фильмов
const filmsPresenter = new FilmsPresenter(main);
filmsPresenter.init(films);

render(footerStats, new FooterStatsView(films.length), AFTERBEGIN); // Количество фильмов
