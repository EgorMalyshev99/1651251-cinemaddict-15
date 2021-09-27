import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import {
  render,
  remove
} from './utils/render.js';
import FilterPresenter from './presenter/filter.js';
import ProfileView from './view/profile.js';
import MenuContainerView from './view/menu-container.js';
import FilmsPresenter from './presenter/movie-list.js';
import StatsLinkView from './view/stats-link.js';
import StatsView from './view/stats.js';
import {
  MenuItem,
  UpdateType
} from './const.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic h22sdasdSwcl34a2j';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();

const filterModel = new FilterModel();

const header = document.querySelector('.header');
const main = document.querySelector('.main');
export const footerStats = document.querySelector('.footer__statistics');

render(header, new ProfileView());
const menuContainerView = new MenuContainerView();
render(main, menuContainerView);
const menuContainer = menuContainerView.getElement();
const statsLink = new StatsLinkView();
render(menuContainer, statsLink);

const filmsPresenter = new FilmsPresenter(main, filmsModel, filterModel, api);
const filterPresenter = new FilterPresenter(menuContainer, filterModel, filmsModel);

let statsComponent = null;

export const handleSiteMenuClick = (item) => {
  switch (item) {
    case MenuItem.FILMS:
      filmsPresenter.destroy();
      filmsPresenter.init();
      filterPresenter.checkLinks(item);
      statsLink.checkActive(item);
      remove(statsComponent);
      break;
    case MenuItem.STATS:
      filmsPresenter.destroy();
      if (statsComponent !== null) {
        remove(statsComponent);
      }
      filterPresenter.checkLinks(item);
      statsLink.checkActive(item);
      statsComponent = new StatsView(filmsModel.getFilms());
      statsComponent.setFilterChangeStatistic();
      render(main, statsComponent);
      break;
  }
};

statsLink.setMenuClickHandler(handleSiteMenuClick);

filmsPresenter.init();
filterPresenter.init();

api.getFilms()
  .then((films) => {
    const commentsFromRequests = [];
    const totalComments = [];

    films.map((film) => {
      commentsFromRequests.push(api.getCommentsByFilmId(film.id));
    });

    Promise.all(commentsFromRequests)
      .then((allComments) => {
        allComments.forEach((commentItem) => {
          commentItem.forEach((comment) => {
            totalComments.push(comment);
          });
        });
        filmsModel.setFilms(UpdateType.INIT, films, totalComments);
      });
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, [], []);
  });
