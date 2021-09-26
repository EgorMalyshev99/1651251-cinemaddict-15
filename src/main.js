import {
  generateFilm
} from './mock/film.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import {
  RenderPoints,
  render,
  remove
} from './utils/render.js';
import FilterPresenter from './presenter/filter.js';
import ProfileView from './view/profile.js';
import MenuContainerView from './view/menu-container.js';
import FilmsPresenter from './presenter/movie-list.js';
import FooterStatsLinkView from './view/films-count.js';
import StatsLinkView from './view/stats-link.js';
import StatsView from './view/stats.js';
import { FilterType, MenuItem, UpdateType } from './const.js';

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

let statsComponent = null;
// let statsLink = null;
let currentScreen = MenuItem.FILMS;

render(header, new ProfileView());
const menuContainerView = new MenuContainerView();
render(main, menuContainerView);
const menuContainer = menuContainerView.getElement();
let statsLink = new StatsLinkView();
render(menuContainer, statsLink);

const filmsPresenter = new FilmsPresenter(main, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(menuContainer, filterModel, filmsModel);

filterPresenter.init();
filmsPresenter.init(currentScreen);

const handleSiteMenuClick = (item) => {
  switch (item) {
    case MenuItem.FILMS:
      currentScreen = MenuItem.FILMS;
      (statsLink !== null) ? remove(statsLink) : '';
      statsLink = null;
      statsLink = new StatsLinkView(currentScreen);
      render(menuContainer, statsLink);
      statsLink.setMenuChangeHandler(handleSiteMenuClick);
      filterPresenter.destroy();
      filterPresenter.init(currentScreen);
      filmsPresenter.init();
      remove(statsComponent);
      break;
    case MenuItem.STATS:
      currentScreen = MenuItem.STATS;
      (statsLink !== null) ? remove(statsLink) : '';
      statsLink = null;
      statsLink = new StatsLinkView(currentScreen);
      render(menuContainer, statsLink);
      statsLink.setMenuChangeHandler(handleSiteMenuClick);
      filterPresenter.destroy();
      filterPresenter.init(currentScreen);
      filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      filmsPresenter.destroy();
      statsComponent = new StatsView(main, films);
      statsComponent.setFilterChangeStatistic();
      render(main, statsComponent);
      break;
  }
};

filterPresenter.setMenuClickHandler(handleSiteMenuClick);
statsLink.setMenuChangeHandler(handleSiteMenuClick);

render(footerStats, new FooterStatsLinkView(films.length), AFTERBEGIN);
