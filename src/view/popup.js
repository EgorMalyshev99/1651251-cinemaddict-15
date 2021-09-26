import {
  isEnterEvent
} from '../utils/check-events.js';
import Smart from './smart.js';

const createComments = (allComments) => {
  let markup = '';
  allComments.forEach((comment) => {
    const {
      id,
      author,
      text,
      date,
      emoji,
    } = comment;

    markup += `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${emoji}" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${date}</span>
          <button class="film-details__comment-delete" data-id="${id}">Delete</button>
        </p>
      </div>
    </li>`;
  });

  return markup;
};

const createPopup = (data) => {
  const {
    poster,
    ageLimit,
    name,
    altName,
    rating,
    director,
    writers,
    actors,
    releaseDate,
    duration,
    country,
    genres,
    description,
    isComments,
    emoji,
    altText,
    commentText,
  } = data;

  const isActiveClass = (status) => status === true ? 'film-details__control-button--active' : '';

  const addEmoji = (imgSrc, altDesc) => `${imgSrc ? `<img src="${imgSrc}" width="55" height="55" alt="emoji-${altDesc}"></img>` : ''}`;

  return `<section class="film-details">
            <form class="film-details__inner" action="" method="get">
              <div class="film-details__top-container">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="${poster}" alt="">

                    <p class="film-details__age">${ageLimit}</p>
                  </div>

                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${name}</h3>
                        <p class="film-details__title-original">Original: ${altName}</p>
                      </div>

                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${rating}</p>
                      </div>
                    </div>

                    <table class="film-details__table">
                      <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${director}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${writers.join(', ')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${actors.join(', ')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">${releaseDate.fullDate}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${duration}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">${country}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Genres</td>
                        <td class="film-details__cell">
                          <span class="film-details__genre">${genres.join(', ')}</span>
                          <!--<span class="film-details__genre">Film-Noir</span>
                          <span class="film-details__genre">Mystery</span>-->
                        </td>
                      </tr>
                    </table>

                    <p class="film-details__film-description">
                      ${description}
                    </p>
                  </div>
                </div>

                <section class="film-details__controls">
                  <button type="button" class="film-details__control-button film-details__control-button--watchlist ${isActiveClass(data.status.isWatchList)}" id="watchlist" name="watchlist">Add to watchlist</button>
                  <button type="button" class="film-details__control-button film-details__control-button--watched ${isActiveClass(data.status.isHistory)}" id="watched" name="watched">Already watched</button>
                  <button type="button" class="film-details__control-button film-details__control-button--favorite ${isActiveClass(data.status.isFavorite)}" id="favorite" name="favorite">Add to favorites</button>
                </section>
              </div>

              <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">
                  <h3 class="film-details__comments-title">Comments: <span class="film-details__comments-count">${data.comments.length}</span></h3>

                  <ul class="film-details__comments-list">
                    ${isComments ? createComments(data.comments) : ''}
                  </ul>

                  <div class="film-details__new-comment">
                    <div class="film-details__add-emoji-label">${emoji ? addEmoji(emoji, altText) : ''}</div>

                    <label class="film-details__comment-label">
                      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentText ? commentText : ''}</textarea>
                    </label>

                    <div class="film-details__emoji-list">
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile"
                        value="smile">
                      <label class="film-details__emoji-label" for="emoji-smile">
                        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio"
                        id="emoji-sleeping" value="sleeping">
                      <label class="film-details__emoji-label" for="emoji-sleeping">
                        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke"
                        value="puke">
                      <label class="film-details__emoji-label" for="emoji-puke">
                        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry"
                        value="angry">
                      <label class="film-details__emoji-label" for="emoji-angry">
                        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                      </label>
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </section>`;
};

export default class Popup extends Smart {
  constructor(film) {
    super();
    this._data = Popup.parseFilmToData(film);

    // Bind handlers //
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._chooseEmojiClickHandler = this._chooseEmojiClickHandler.bind(this);
    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);
    this._commentAddHandler = this._commentAddHandler.bind(this);
    this._commentTextInputHandler = this._commentTextInputHandler.bind(this);
    this._currentScrollPosition = this._currentScrollPosition.bind(this);
    // / Bind handlers //

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopup(this._data);
  }

  reset(film) {
    this.updateData(
      Popup.parseFilmToData(film),
    );
  }

  // Handlers //
  _closePopupHandler(evt) {
    evt.preventDefault();
    this._callback.closePopupClick();
  }

  _watchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchListClick(this._scrollPosition);
  }

  _historyClickHandler(evt) {
    evt.preventDefault();
    this._callback.historyClick(this._scrollPosition);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick(this._scrollPosition);
  }

  _chooseEmojiClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      emoji: `./images/emoji/${evt.target.value}.png`,
      altText: `emoji-${evt.target.value}`,
    });
  }

  _commentDeleteClickHandler(evt) {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    evt.preventDefault();
    this._callback.commentDeleteClick(evt.target.dataset.id, this._scrollPosition);
  }

  _commentAddHandler(evt) {
    if (isEnterEvent(evt) || evt.ctrlKey) {
      evt.preventDefault();
      const newCommentText = this.getElement().querySelector('.film-details__comment-input').value;
      if (this._data.emoji) {
        this._callback.commentAdd(this._data.emoji, newCommentText, this._scrollPosition);
      }
    }
  }

  _commentTextInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      commentText: evt.target.value,
    }, true);
  }

  _currentScrollPosition() {
    this._scrollPosition = this.getElement().scrollTop;
  }

  setScrollPosition(position) {
    this.getElement().scroll(0, position);
  }
  // / Handlers //

  // Set Handlers //
  setWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._watchListClickHandler);
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._historyClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setClosePopupHandler(callback) {
    this._callback.closePopupClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closePopupHandler);
  }

  setDeleteCommentHandler(callback) {
    this._callback.commentDeleteClick = callback;
    this.getElement().querySelectorAll('.film-details__comment-delete').forEach((btn) => {
      btn.addEventListener('click', this._commentDeleteClickHandler);
    });
  }

  setAddCommentHandler(callback) {
    this._callback.commentAdd = callback;
    this.getElement().querySelector('.film-details__new-comment').addEventListener('keydown', this._commentAddHandler);
  }

  _setInnerHandlers() {
    this.getElement().querySelectorAll('.film-details__emoji-item').forEach((item) => {
      item.addEventListener('click', this._chooseEmojiClickHandler);
    });
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentTextInputHandler);
    this.getElement().addEventListener('scroll', this._currentScrollPosition);
  }
  // / Set handlers //

  // Restore handlers //
  restoreHandlers() {
    this._setInnerHandlers();
    this.setClosePopupHandler(this._callback.closePopupClick);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setHistoryClickHandler(this._callback.historyClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setDeleteCommentHandler(this._callback.commentDeleteClick);
    this.setAddCommentHandler(this._callback.commentAdd);
  }
  // / Restore handlers //

  // Static methods //
  static parseFilmToData(film) {
    return Object.assign({},
      film, {
        isComments: film.comments.length !== 0,
        isEmoji: film.emoji !== null,
        isCommentText: film.commentText !== null,
        emoji: '',
        altText: '',
        commentText: '',
      },
    );
  }

  static parseDataToFilm(data) {
    data = Object.assign({},
      data,
    );

    delete data.emoji;
    delete data.altText;
    delete data.commentText;
    delete data.isEmoji;
    delete data.isAltText;
    delete data.isCommentText;

    return data;
  }
  // / Static methods //
}
