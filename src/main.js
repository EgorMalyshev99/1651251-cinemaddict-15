import {
  listTitles
} from './data.js';
import {
  generateFilm
} from './mock/film.js';
import {
  isEscEvent
} from './utils/check-events.js';
import {
  RenderPoints,
  render,
  remove
} from './utils/render.js';
import CommentView from './view/comment.js';
import FilmCardView from './view/film-card.js';
import FooterStatsView from './view/films-count.js';
import filmsListItemView from './view/list-item.js';
import FilmsListView from './view/list.js';
import SiteMenuView from './view/menu.js';
import MoreBtnView from './view/more-button.js';
import PopupView from './view/popup.js';
import SortView from './view/sort.js';
import StatsView from './view/stats.js';

const FILMS_COUNT_PER_STEP = 5;
const NUMBER_OF_FILMS = 20;

const films = new Array(NUMBER_OF_FILMS).fill().map(generateFilm);

const body = document.querySelector('body');
const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footerStats = document.querySelector('.footer__statistics');

const {
  AFTERBEGIN,
} = RenderPoints;

render(header, new StatsView()); // Имя профиля

render(main, new SiteMenuView(films), AFTERBEGIN); // Отрисовка меню

render(main, new SortView()); // Сортировка

render(main, new FilmsListView()); // Список фильмов

render(footerStats, new FooterStatsView(films.length), AFTERBEGIN); // Количество фильмов

const listsWrap = document.querySelector('.films');
render(listsWrap, new filmsListItemView(listTitles.ALL), AFTERBEGIN); // Главный список

const filmsListsContainers = document.querySelectorAll('.films-list__container');

const renderCards = (elements, count, place) => {
  let commentsWraps = new Array;
  const currentCommentWraps = new Array;

  for (let i = 0; i < Math.min(elements.length, count); i++) {
    let cards = new Array;

    // Создаем карточку
    const card = new FilmCardView(elements[i]);
    render(place, card);
    cards = document.querySelectorAll('.film-card');
    const currentCard = cards[cards.length - 1];
    const currentCardParts = {
      title: currentCard.querySelector('.film-card__title'),
      poster: currentCard.querySelector('.film-card__poster'),
      commentsBtn: currentCard.querySelector('.film-card__comments'),
    };

    // Создаем попап карточки
    const popupComponent = new PopupView(elements[i]);
    render(body, popupComponent);
    const popups = document.querySelectorAll('.film-details');
    const currentPopup = popups[popups.length - 1];

    commentsWraps = document.querySelectorAll('.film-details__comments-list');
    currentCommentWraps.push(commentsWraps[commentsWraps.length - 1]);

    const showPopupHandler = () => {
      currentPopup.classList.remove('visually-hidden');
      body.classList.add('hide-overflow');

      // Отрисовка комментариев
      if (!currentCommentWraps[i].hasChildNodes()) {
        elements[i].comments.forEach((comment) => {
          const singleComment = new CommentView(comment);
          render(currentCommentWraps[i], singleComment);
        });
      }
      const closePopupBtn = currentPopup.querySelector('.film-details__close-btn');
      const closePopupHandler = () => {
        currentPopup.classList.add('visually-hidden');
        body.classList.remove('hide-overflow');
        closePopupBtn.removeEventListener('click', closePopupHandler);
      };
      const escPopupHandler = (event) => {
        if (isEscEvent(event)) {
          currentPopup.classList.add('visually-hidden');
          document.removeEventListener('keydown', escPopupHandler);
        }
      };
      closePopupBtn.addEventListener('click', closePopupHandler);
      document.addEventListener('keydown', escPopupHandler);
    };

    // Добавляем листенеры
    for (const value in currentCardParts) {
      currentCardParts[value].addEventListener('click', showPopupHandler);
      currentCardParts[value].style.cursor = 'pointer';
    }
  }
};

const renderCard = (card, place) => {
  // Создаем карточку
  render(place, card);
  const cardTitle = card.querySelector('.film-card__title');
  const cardPoster = card.querySelector('.film-card__poster');
  const commentsBtn = card.querySelector('.film-card__comments');

  // Создаем попап карточки
  const popupComponent = new PopupView(card);
  render(body, popupComponent);

  const showPopupHandler = () => {
    popupComponent.classList.remove('visually-hidden');
    body.classList.add('hide-overflow');

    // Отрисовка комментариев
    card.comments.forEach((comment) => {
      const singleComment = new CommentView(comment);
      render(popupComponent.querySelector('.film-details__comments-list'), singleComment);
    });
    const closePopupBtn = popupComponent.querySelector('.film-details__close-btn');
    const closePopupHandler = () => {
      popupComponent.classList.add('visually-hidden');
      body.classList.remove('hide-overflow');
      closePopupBtn.removeEventListener('click', closePopupHandler);
    };
    const escPopupHandler = (event) => {
      if (isEscEvent(event)) {
        popupComponent.classList.add('visually-hidden');
        document.removeEventListener('keydown', escPopupHandler);
      }
    };
    closePopupBtn.addEventListener('click', closePopupHandler);
    document.addEventListener('keydown', escPopupHandler);
  };

  // Добавляем листенеры
  // for (const value in currentCardParts) {
  //   currentCardParts[value].addEventListener('click', showPopupHandler);
  //   currentCardParts[value].style.cursor = 'pointer';
  // }

};

for (let i = 0; i < films.length; i++) {
  const card = new FilmCardView(films[i]);
  renderCard(card);
}


// Отрисовка всех фильмов
renderCards(films, FILMS_COUNT_PER_STEP, filmsListsContainers[0]);

// Логика кнопки "Показать ещё"
const mainList = document.querySelectorAll('.films-list')[0];

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_COUNT_PER_STEP;

  const loadMoreButtonComponent = new MoreBtnView();

  render(mainList, loadMoreButtonComponent); // Добавляем кнопку "Показать еще" в главный список

  loadMoreButtonComponent.setClickHandler(() => {

    renderCards(films.slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP), FILMS_COUNT_PER_STEP, filmsListsContainers[0]);
    renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmsCount >= films.length) {
      remove(loadMoreButtonComponent);
    }
  });
}
