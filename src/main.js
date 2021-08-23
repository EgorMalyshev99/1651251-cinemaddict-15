import {
  LIST_TITLES
} from './data.js';
import {
  generateFilm
} from './mock/film.js';
import {
  createComponent,
  PASTE_POINTS
} from './utils/create-component.js';
import {
  addVisibleLogicToElements
} from './utils/visible-on.js';
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

const {
  afterBegin,
} = PASTE_POINTS;

createComponent(header, stats); // Имя профиля

createComponent(main, createMainNav(films), afterBegin); // Отрисовка меню


createComponent(main, createSort()); // Сортировка

createComponent(main, filmsList); // Список фильмов

createComponent(footerStats, filmsCount(films.length)); // Количество фильмов

const listsWrap = document.querySelector('.films');
createComponent(listsWrap, filmsListItem(LIST_TITLES.all), afterBegin); // Главный список

createComponent(listsWrap, filmsListItem(LIST_TITLES.top)); // Cписок "Top rated"
createComponent(listsWrap, filmsListItem(LIST_TITLES.comment)); // Список "Most commented"

const filmsListsContainers = document.querySelectorAll('.films-list__container');

// Отрисовка попапов с информацией о фильме
films.forEach((film) => {
  createComponent(body, createPopup(film));
});

// Отрисовка комментариев
const commentsWraps = document.querySelectorAll('.film-details__comments-list');
commentsWraps.forEach((wrap, index) => {
  films[index].comments.forEach((comment) => {
    createComponent(wrap, createComment(comment));
  });
});

// Отрисовка всех фильмов
for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  createComponent(filmsListsContainers[0], createFilmCard(films[i]));
}

// Отрисовка 2 карточек фильмов в списке "Top rated" и "Most commented"
for (let i = 0; i < OTHER_FILMS_COUNT; i++) {
  createComponent(filmsListsContainers[1], createFilmCard(films[i + 5]));
  createComponent(filmsListsContainers[2], createFilmCard(films[i + 10]));
}

// Раскрытие попапа
const popups = document.querySelectorAll('.film-details');
const closePopupBtns = document.querySelectorAll('.film-details__close-btn');
let titles = document.querySelectorAll('.film-card__title');
let posters = document.querySelectorAll('.film-card__poster');
let commentsBtns = document.querySelectorAll('.film-card__comments');

closePopupBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    popups[index].classList.add('visually-hidden');
  });
});

addVisibleLogicToElements(titles, popups);
addVisibleLogicToElements(posters, popups);
addVisibleLogicToElements(commentsBtns, popups);

// Логика кнопки "Показать ещё"
const mainList = document.querySelectorAll('.films-list')[0];
if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedTaskCount = FILMS_COUNT_PER_STEP;

  createComponent(mainList, moreBtn); // Добавляем кнопку "Показать еще" в главный список

  const loadMoreButton = mainList.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedTaskCount, renderedTaskCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => createComponent(filmsListsContainers[0], createFilmCard(film)));

    renderedTaskCount += FILMS_COUNT_PER_STEP;

    if (renderedTaskCount >= films.length) {
      loadMoreButton.remove();
    }

    titles = document.querySelectorAll('.film-card__title');
    posters = document.querySelectorAll('.film-card__poster');
    commentsBtns = document.querySelectorAll('.film-card__comments');
    addVisibleLogicToElements(titles, popups);
    addVisibleLogicToElements(posters, popups);
    addVisibleLogicToElements(commentsBtns, popups);
  });
}
