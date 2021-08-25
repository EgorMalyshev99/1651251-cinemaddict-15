import {
  listTitles
} from './data.js';
import {
  generateFilm
} from './mock/film.js';
import {
  createComponent,
  pastePoints
} from './utils/create-component.js';
import {
  getSomeItems
} from './utils/get-some-items.js';
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
} = pastePoints;

createComponent(header, stats); // Имя профиля

createComponent(main, createMainNav(films), afterBegin); // Отрисовка меню

createComponent(main, createSort()); // Сортировка

createComponent(main, filmsList); // Список фильмов

createComponent(footerStats, filmsCount(films.length)); // Количество фильмов

const listsWrap = document.querySelector('.films');
createComponent(listsWrap, filmsListItem(listTitles.all), afterBegin); // Главный список

createComponent(listsWrap, filmsListItem(listTitles.top)); // Cписок "Top rated"
createComponent(listsWrap, filmsListItem(listTitles.comment)); // Список "Most commented"

const filmsListsContainers = document.querySelectorAll('.films-list__container');

const renderCards = (elements, count, place) => {

  for (let i = 0; i < Math.min(elements.length, count); i++) {
    let cards = new Array;
    // Создаем карточку
    createComponent(place, createFilmCard(elements[i]));
    cards = document.querySelectorAll('.film-card');
    const currentCard = cards[cards.length - 1];
    const currentCardParts = {
      title: currentCard.querySelector('.film-card__title'),
      poster: currentCard.querySelector('.film-card__poster'),
      commentsBtn: currentCard.querySelector('.film-card__comments'),
    };

    // Создаем попап карточки
    createComponent(body, createPopup(elements[i]));
    const popups = document.querySelectorAll('.film-details');
    const currentPopup = popups[popups.length - 1];

    const showPopupHandler = () => {
      currentPopup.classList.remove('visually-hidden');
      const closePopupBtn = currentPopup.querySelector('.film-details__close-btn');
      const closePopupHandler = () => {
        currentPopup.classList.add('visually-hidden');
        closePopupBtn.removeEventListener('click', closePopupHandler);
      };
      closePopupBtn.addEventListener('click', closePopupHandler);
    };

    // Добавляем листенеры
    for (const value in currentCardParts) {
      currentCardParts[value].addEventListener('click', showPopupHandler);
      currentCardParts[value].style.cursor = 'pointer';
    }
  }
};

// Отрисовка всех фильмов
renderCards(films, FILMS_COUNT_PER_STEP, filmsListsContainers[0]);

// Отрисовка 2 карточек фильмов в списке "Top rated" и "Most commented"
const mockTopRatedFilms = getSomeItems(films, 5);
const mockMostCommentedFilms = getSomeItems(films, 5);

renderCards(mockTopRatedFilms, OTHER_FILMS_COUNT, filmsListsContainers[1]);
renderCards(mockMostCommentedFilms, OTHER_FILMS_COUNT, filmsListsContainers[2]);

// Отрисовка комментариев
const commentsWraps = document.querySelectorAll('.film-details__comments-list');
commentsWraps.forEach((wrap, index) => {
  films[index].comments.forEach((comment) => {
    createComponent(wrap, createComment(comment));
  });
});

// Логика кнопки "Показать ещё"
const mainList = document.querySelectorAll('.films-list')[0];
if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_COUNT_PER_STEP;

  createComponent(mainList, moreBtn); // Добавляем кнопку "Показать еще" в главный список

  const loadMoreButton = mainList.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    // films
    //   .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
    //   .forEach((film) => createComponent(filmsListsContainers[0], createFilmCard(film)));

    renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmsCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}
