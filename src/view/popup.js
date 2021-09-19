import AbstractView from './abstract.js';

const createComments = (allComments, isComments) => {
  let markup = '';
  if (allComments) {
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
    // isComments,
  } = data;

  const isActiveClass = (status) => {
    if (status === true) {
      return 'film-details__control-button--active';
    } else {
      return '';
    }
  };

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
                    <div class="film-details__add-emoji-label"></div>

                    <label class="film-details__comment-label">
                      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
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
    this._data = film;
    // this._currentEmoji = null;
    // this._currentEmojiContainer = this.getElement().querySelector('.film-details__add-emoji-label');
    // this._emojiButtons = this.getElement().querySelectorAll('.film-details__emoji-item');

    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._closePopupHandler = this._closePopupHandler.bind(this);
  }

  getTemplate() {
    return createPopup(this._data);
  }

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

  // _chooseEmojiLogic() {
  //   this._emojiButtons.forEach((btn) => {
  //     btn.addEventListener('change', () => {
  //       const emojiImg = document.createElement('img');
  //       emojiImg.src = `./images/emoji/${btn.value}.png`;
  //     });
  //   });
  // }

  // _formSubmitHandler(evt) {
  //   evt.preventDefault();
  //   this._callback.formSubmit(Popup.parseDataToFilm(this._data));
  // }

  // setFormSubmitHandler(callback) {
  //   this._callback.formSubmit = callback;
  //   this.getElement().querySelector('.film-details__comment-input').addEventListener('keydown', this._formSubmitHandler);
  // }

  // static parseFilmToData(film) {
  //   return Object.assign({},
  //     film, {
  //       isComents: film.comments.length !== 0,
  //     },
  //   );
  // }

  // static parseDataToFilm(data) {
  //   data = Object.assign({}, data);

  //   if (!data.isComments) {
  //     data.comments.length = 0;
  //   }

  //   delete data.isComments;

  //   return data;
  // }
}
