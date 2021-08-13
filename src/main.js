import {
  MAINFILMSCOUNT,
  MOSTCOMMENTEDFILMSCOUNT,
  TOPRATEDFILMSCOUNT
} from './data.js';
import {
  createComponent
} from './utils/create-component.js';
import {
  filmCard
} from './view/film-card.js';
import {
  filmsCount
} from './view/footer.js';
import {
  extraList
} from './view/list-item-extra.js';
import {
  filmsListItem
} from './view/list-item.js';
import {
  filmsList
} from './view/list.js';
import {
  mainNav
} from './view/menu.js';
import {
  moreBtn
} from './view/more-button.js';
import {
  popup
} from './view/popup.js';
import {
  sort
} from './view/sort.js';
import {
  stats
} from './view/stats.js';

const body = document.querySelector('body');
const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footerStats = document.querySelector('.footer__statistics');

createComponent(header, stats, 'beforeend'); // Имя профиля

createComponent(main, mainNav, 'afterbegin'); // Отрисовка меню

createComponent(main, sort, 'beforeend'); // Сортировка

createComponent(main, filmsList, 'beforeend'); // Список фильмов

createComponent(footerStats, filmsCount, 'beforeend'); // Количество фильмов

const listsWrap = document.querySelector('.films');
createComponent(listsWrap, filmsListItem, 'afterbegin'); // Главный список

const mainList = document.querySelector('.films-list');
createComponent(mainList, moreBtn, 'beforeend'); // Добавляем кнопку "Показать еще" в главный список

createComponent(listsWrap, extraList, 'beforeend'); // Cписок "Top rated"
createComponent(listsWrap, extraList, 'beforeend'); // Список "Most commented"
const extraListsTitles = document.querySelectorAll('.films-list--extra .films-list__title');

extraListsTitles[0].innerText = 'Top rated';
extraListsTitles[1].innerText = 'Most commented';

const filmsListsContainers = document.querySelectorAll('.films-list__container');

// Отрисовка 5 карточек фильмов в главный список
for (let index = 1; index <= MAINFILMSCOUNT; index++) {
  createComponent(filmsListsContainers[0], filmCard, 'beforeend');
}

// Отрисовка 2 карточек фильмов в списке "Top rated"
for (let index = 1; index <= TOPRATEDFILMSCOUNT; index++) {
  createComponent(filmsListsContainers[1], filmCard, 'beforeend');
}

// Отрисовка 2 карточек фильмов в списке "Most commented"
for (let index = 1; index <= MOSTCOMMENTEDFILMSCOUNT; index++) {
  createComponent(filmsListsContainers[2], filmCard, 'beforeend');
}

// Попап с информацией о фильме
createComponent(body, popup, 'beforeend');
