import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import {
  isEscEvent
} from '../utils/check-events.js';
import {
  render,
  remove,
  replace
} from '../utils/render';
import {
  UpdateType,
  UserAction
} from '../const.js';
import he from 'he';

const Mode = {
  DEFAULT: 'DEFAULT',
  SHOWING: 'SHOWING',
};

const createComment = () => {
  const comment = {
    id: null,
    author: null,
    text: null,
    date: null,
    emoji: null,
  };

  return comment;
};

export default class Movie {
  constructor(filmsListContainer, changeData, changeMode) {
    this._filmsListContainer = filmsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._body = document.querySelector('body');

    this._filmComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleShowPopup = this._handleShowPopup.bind(this);
    this._handleClosePopup = this._handleClosePopup.bind(this);
    this._handleEscPopup = this._handleEscPopup.bind(this);
    this._handleDeleteComment = this._handleDeleteComment.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._popupComponent;

    this._filmComponent = new FilmCardView(film);
    this._popupComponent = new PopupView(film);

    this._filmComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmComponent.setShowPopupHandler(this._handleShowPopup);
    this._popupComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popupComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._popupComponent.setClosePopupHandler(this._handleClosePopup);
    this._popupComponent.setDeleteCommentHandler(this._handleDeleteComment);
    this._popupComponent.setAddCommentHandler(this._handleAddComment);

    if (prevFilmComponent === null || prevPopupComponent === null) {
      this._renderFilm();
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._mode === Mode.SHOWING) {
      replace(this._filmComponent, prevFilmComponent);
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._popupComponent);
  }

  _handleShowPopup() {
    this._showPopup();
  }

  _handleClosePopup() {
    this._hidePopup();
    this._popupComponent.getElement().querySelector('.film-details__close-btn').removeEventListener('click', this._handleClosePopup);
  }

  _handleEscPopup(event) {
    if (isEscEvent(event)) {
      this._hidePopup();
    }
  }

  _handleWatchListClick(popupScroll = null) {
    if (this._mode === Mode.DEFAULT) {
      this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign({},
          this._film, {
            status: {
              isWatchList: !this._film.status.isWatchList,
              isHistory: this._film.status.isHistory,
              isFavorite: this._film.status.isFavorite,
            },
          },
        ),
      );
    } else {
      this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign({},
          this._film, {
            status: {
              isWatchList: !this._film.status.isWatchList,
              isHistory: this._film.status.isHistory,
              isFavorite: this._film.status.isFavorite,
            },
          },
        ),
      );

      if (popupScroll !== null) {
        this._popupComponent.setScrollPosition(popupScroll);
      }
    }
  }

  _handleHistoryClick(popupScroll = null) {
    if (this._mode === Mode.DEFAULT) {
      this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign({},
          this._film, {
            status: {
              isWatchList: this._film.status.isWatchList,
              isHistory: !this._film.status.isHistory,
              isFavorite: this._film.status.isFavorite,
            },
          },
        ),
      );
    } else {
      this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign({},
          this._film, {
            status: {
              isWatchList: this._film.status.isWatchList,
              isHistory: !this._film.status.isHistory,
              isFavorite: this._film.status.isFavorite,
            },
          },
        ),
      );

      if (popupScroll !== null) {
        this._popupComponent.setScrollPosition(popupScroll);
      }
    }
  }

  _handleFavoriteClick(popupScroll = null) {
    if (this._mode === Mode.DEFAULT) {
      this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign({},
          this._film, {
            status: {
              isWatchList: this._film.status.isWatchList,
              isHistory: this._film.status.isHistory,
              isFavorite: !this._film.status.isFavorite,
            },
          },
        ),
      );
    } else {
      this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign({},
          this._film, {
            status: {
              isWatchList: this._film.status.isWatchList,
              isHistory: this._film.status.isHistory,
              isFavorite: !this._film.status.isFavorite,
            },
          },
        ),
      );

      if (popupScroll !== null) {
        this._popupComponent.setScrollPosition(popupScroll);
      }
    }
  }

  _handleAddComment(emoji, text, popupScroll = null) {
    const newComment = createComment();
    newComment.emoji = emoji;
    newComment.text = he.encode(text);

    const newCommentsList = this._film.comments.slice();
    newCommentsList.push(newComment);

    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      Object.assign({},
        this._film, {
          comments: newCommentsList,
        },
      ),
    );

    if (popupScroll !== null) {
      this._popupComponent.setScrollPosition(popupScroll);
    }
  }

  _handleDeleteComment(id, popupScroll = null) {
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      Object.assign({},
        this._film, {
          comments: this._film.comments.filter((comment) => comment.id !== id),
        },
      ),
    );

    if (popupScroll !== null) {
      this._popupComponent.setScrollPosition(popupScroll);
    }
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._hidePopup();
      this._body.classList.add('hide-overflow');
    }
  }

  _showPopup() {
    this._renderPopup();
    this._body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._handleEscPopup);

    this._changeMode();
    this._mode = Mode.SHOWING;
  }

  _hidePopup() {
    remove(this._popupComponent);
    this._body.classList.remove('hide-overflow');
    this._popupComponent.reset(this._film);
    document.removeEventListener('keydown', this._handleEscPopup);

    this._mode = Mode.DEFAULT;
  }

  _renderPopup() {
    render(this._body, this._popupComponent);
  }

  _renderFilmCard() {
    render(this._filmsListContainer, this._filmComponent);
  }

  _renderFilm() {
    this._renderFilmCard();
  }
}
