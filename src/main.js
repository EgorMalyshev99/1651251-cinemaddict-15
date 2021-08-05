import {
  createComponent
} from './utils/create-component.js';
import {
  filmCard
} from './view/film-card.js';
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

createComponent(header, stats, 'beforeend'); // Имя профиля

createComponent(main, mainNav, 'afterbegin'); // Отрисовка меню

createComponent(main, sort, 'beforeend'); // Сортировка

createComponent(main, filmsList, 'beforeend'); // Список фильмов

const listsWrap = document.querySelector('.films');
createComponent(listsWrap, filmsListItem, 'beforeend'); // Отдельный список
createComponent(listsWrap, filmsListItem, 'beforeend'); // Отдельный список
createComponent(listsWrap, filmsListItem, 'beforeend'); // Отдельный список

const filmsLists = document.querySelectorAll('.films-list');
const filmsListsTitles = document.querySelectorAll('.films-list__title');
filmsListsTitles[0].innerText = 'All movies. Upcoming';
filmsListsTitles[0].classList.add('visually-hidden');
filmsListsTitles[1].innerText = 'Top rated';
filmsListsTitles[2].innerText = 'Most commented';
const filmsListsContainers = document.querySelectorAll('.films-list__container');

// Отрисовка 5 карточек фильмов в первый список 
for (let index = 0; index <= 4; index++) {
  createComponent(filmsListsContainers[0], filmCard, 'beforeend');
}

// Отрисовка 2 карточек фильмов во второй список 
for (let index = 0; index <= 1; index++) {
  createComponent(filmsListsContainers[1], filmCard, 'beforeend');
}

// Отрисовка 2 карточек фильмов в третий список 
for (let index = 0; index <= 1; index++) {
  createComponent(filmsListsContainers[2], filmCard, 'beforeend');
}

// Добавляем кнопку "Показать еще" в каждый список
filmsLists.forEach((list) => {
  createComponent(list, moreBtn, 'beforeend');
});

// Попап с информацией о фильме
createComponent(body, popup, 'beforeend');
const filmDetails = document.querySelector('.film-details');
filmDetails.classList.add('visually-hidden');

const filmsPosters = document.querySelectorAll('.film-card__poster');
filmsPosters.forEach((film) => {
  film.addEventListener('click', () => {
    filmDetails.classList.remove('visually-hidden');
  });
});

const closeDetailsBtn = document.querySelector('.film-details__close-btn');
closeDetailsBtn.addEventListener('click', () => {
  filmDetails.classList.add('visually-hidden');
});
