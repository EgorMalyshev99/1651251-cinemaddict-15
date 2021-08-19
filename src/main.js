import {
  generateFilm
} from './mock/film.js';
import {
  createComponent
} from './utils/create-component.js';
import {
  createComment
} from './view/comment.js';
import {
  createFilmCard
} from './view/film-card.js';
import {
  filmsCount
} from './view/footer.js';
import {
  filmsListItem
} from './view/list-item.js';
import {
  filmsList
} from './view/list.js';
import {
  createMainNav
} from './view/menu.js';
import {
  moreBtn
} from './view/more-button.js';
import {
  createPopup
} from './view/popup.js';
import {
  createSort
} from './view/sort.js';
import {
  stats
} from './view/stats.js';

const FILMS_COUNT_PER_STEP = 5;
const OTHER_FILMS_COUNT = 2;
const NUMBER_OF_FILMS = 20;
const films = new Array(NUMBER_OF_FILMS).fill().map(generateFilm);

const body = document.querySelector('body');
const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footerStats = document.querySelector('.footer__statistics');

let watchListFilmsCount = 0;
let historyFilmsCount = 0;
let favoritesFilmsCount = 0;

films.forEach((film) => {
  if (film.status.isWatchList) {
    watchListFilmsCount++;
  }
  if (film.status.isHistory) {
    historyFilmsCount++;
  }
  if (film.status.isFavorite) {
    favoritesFilmsCount++;
  }
});

const filterStats = {
  watchList: watchListFilmsCount,
  history: historyFilmsCount,
  favorites: favoritesFilmsCount,
};

createComponent(header, stats, 'beforeend'); // Имя профиля

createComponent(main, createMainNav(filterStats), 'afterbegin'); // Отрисовка меню

createComponent(main, createSort(), 'beforeend'); // Сортировка

createComponent(main, filmsList, 'beforeend'); // Список фильмов

createComponent(footerStats, filmsCount(films.length), 'beforeend'); // Количество фильмов

const listsWrap = document.querySelector('.films');
createComponent(listsWrap, filmsListItem('All movies. Upcoming'), 'afterbegin'); // Главный список

createComponent(listsWrap, filmsListItem('Top rated'), 'beforeend'); // Cписок "Top rated"
createComponent(listsWrap, filmsListItem('Most commented'), 'beforeend'); // Список "Most commented"

const filmsListsContainers = document.querySelectorAll('.films-list__container');

// Отрисовка попапов с информацией о фильме
films.forEach((film) => {
  createComponent(body, createPopup(film), 'beforeend');
});

// Отрисовка комментариев
const commentsWraps = document.querySelectorAll('.film-details__comments-list');
commentsWraps.forEach((wrap, index) => {
  films[index].comments.forEach((comment) => {
    createComponent(wrap, createComment(comment), 'beforeend');
  });
});

// Отрисовка всех фильмов
for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  createComponent(filmsListsContainers[0], createFilmCard(films[i]), 'beforeend');
}

// Отрисовка 2 карточек фильмов в списке "Top rated" и "Most commented"
for (let i = 0; i < OTHER_FILMS_COUNT; i++) {
  createComponent(filmsListsContainers[1], createFilmCard(films[i + 5]), 'beforeend');
  createComponent(filmsListsContainers[2], createFilmCard(films[i + 10]), 'beforeend');
}

// Логика кнопки "Показать ещё"
const mainList = document.querySelectorAll('.films-list')[0];
if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedTaskCount = FILMS_COUNT_PER_STEP;

  createComponent(mainList, moreBtn, 'beforeend'); // Добавляем кнопку "Показать еще" в главный список

  const loadMoreButton = mainList.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedTaskCount, renderedTaskCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => createComponent(filmsListsContainers[0], createFilmCard(film), 'beforeend'));

    renderedTaskCount += FILMS_COUNT_PER_STEP;

    if (renderedTaskCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}
