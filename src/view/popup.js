import AbstractView from './abstract.js';

const createComments = (allComments, isComments) => {
  let markup = '';
  if (isComments) {
    allComments.forEach((comment) => {
      markup += `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${comment.emoji}" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${comment.text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${comment.date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
    });
  }

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
    genre,
    description,
    emoji,
    imgAltText,
    commentText,
  } = data;

  const isActiveClass = (status) => status === true ? 'film-details__control-button--active' : '';

  const addEmojiImg = (img, altDesc) => `${img ? `<img src="${img}" width="55" height="55" alt="${altDesc ? altDesc : ' '}"></img>` : ''}`;

  const addCommentText = () => commentText ? commentText : '';

  return `<section class="film-details visually-hidden">
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
                          <span class="film-details__genre">${genre}</span>
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
                    ${data.comments.length !== 0 ? createComments(data.comments) : ''}
                  </ul>

                  <div class="film-details__new-comment">
                    <div class="film-details__add-emoji-label">
                      ${addEmojiImg(emoji, imgAltText)}
                    </div>

                    <label class="film-details__comment-label">
                      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">
                        ${addCommentText()}
                      </textarea>
                    </label>

                    <div class="film-details__emoji-list">
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                      <label class="film-details__emoji-label" for="emoji-smile">
                        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                      <label class="film-details__emoji-label" for="emoji-sleeping">
                        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                      <label class="film-details__emoji-label" for="emoji-puke">
                        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
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

export default class Popup extends AbstractView {
  constructor(film) {
    super();
    this._data = Popup.parseFilmToData(film);
    // this._data = film;

    // Bind handlers //
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._smileEmojiClickHandler = this._smileEmojiClickHandler.bind(this);
    this._sleepingEmojiClickHandler = this._sleepingEmojiClickHandler.bind(this);
    this._pukeEmojiClickHandler = this._pukeEmojiClickHandler.bind(this);
    this._angryEmojiClickHandler = this._angryEmojiClickHandler.bind(this);
    this._commentTextInputHandler = this._commentTextInputHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    // / Bind handlers //
  }

  getTemplate() {
    return createPopup(this._data);
  }

  updateData(update) {
    if (!update) {
      return;
    }

    this._data = Object.assign({},
      this._data,
      update,
    );

    this.updateElement();
  }

  reset(film) {
    this.updateData(
      Popup.parseFilmToData(film),
    );
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
  }

  // Handlers //
  _closePopupHandler(event) {
    event.preventDefault();
    this._callback.closePopupClick();
  }

  _watchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchListClick();
  }

  _historyClickHandler(evt) {
    evt.preventDefault();
    this._callback.historyClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _smileEmojiClickHandler(evt) {
    evt.preventDefault();
    console.log('smile');
    this.updateData({
      emoji: './images/emoji/smile.png',
      imgAltText: 'emoji-smile',
    });
  }

  _sleepingEmojiClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      emoji: './images/emoji/sleeping.png',
      imgAltText: 'emoji-sleeping',
    });
  }

  _pukeEmojiClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      emoji: './images/emoji/puke.png',
      imgAltText: 'emoji-puke',
    });
  }

  _angryEmojiClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      emoji: './images/emoji/angry.png',
      imgAltText: 'emoji-angry',
    });
  }

  _commentTextInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      commentText: evt.target.value,
    }, true);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(Popup.parseDataToFilm(this._data));
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

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('#emoji-smile').addEventListener('click', this._smileEmojiClickHandler);
    this.getElement().querySelector('#emoji-sleeping').addEventListener('click', this._sleepingEmojiClickHandler);
    this.getElement().querySelector('#emoji-puke').addEventListener('click', this._pukeEmojiClickHandler);
    this.getElement().querySelector('#emoji-angry').addEventListener('click', this._angryEmojiClickHandler);
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentTextInputHandler);
  }
  // / Set handlers //

  // Restore handlers //
  restoreHandlers() {
    this.setCloseButtonClickHandler(this._callback.click);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoritesClickHandler(this._callback.favoritesClick);
    this._setInnerHandlers();
  }
  // / Restore handlers //

  // Static methods //
  static parseFilmToData(film) {
    return Object.assign({},
      film, {
        isComments: film.comments.length !== 0,
        emoji: '',
        imgAltText: '',
        commentText: '',
      },
    );
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    if (!data.isComments) {
      data.comments = null;
    }

    delete data.emoji;
    delete data.imgAltText;
    delete data.commentText;

    return data;
  }
  // / Static methods //
}
