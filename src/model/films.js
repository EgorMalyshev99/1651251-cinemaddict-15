import AbstractObserver from '../utils/abstract-observer.js';

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
    this._comments = [];
  }

  setFilms(updateType, films, comments) {
    this._films = films.slice();
    this._comments = comments.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  getComments() {
    return this._comments;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addComment(updateType, updateFilm, updateComment) {
    const index = this._films.findIndex((film) => film.id === updateFilm.id);
    const newComment = updateComment[updateComment.length -1];
    updateFilm.commentsId.push(newComment.id);
    updateFilm.isCommentDisabled = false;

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      updateFilm,
      ...this._films.slice(index + 1),
    ];

    this._comments = [
      ...this._comments,
      newComment,
    ];

    this._notify(updateType, updateFilm, updateComment);
  }

  deleteComment(updateType, updateFilm, updateCommentId) {
    const indexFilm = this._films.findIndex((card) => card.id === updateFilm.id);
    let commentIdIndex = null;

    if (indexFilm === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    updateFilm.commentsId.forEach((commentId, index) => {
      if (commentId === updateCommentId) {
        commentIdIndex = index;
      }
    });

    updateFilm.commentsId = [
      ...updateFilm.commentsId.slice(0, commentIdIndex),
      ...updateFilm.commentsId.slice(commentIdIndex + 1),
    ];

    this._films = [
      ...this._films.slice(0, indexFilm),
      updateFilm,
      ...this._films.slice(indexFilm + 1),
    ];

    const indexComment = this._comments.findIndex((comment) => comment.id === updateCommentId);

    this._comments = [
      ...this._comments.slice(0, indexComment),
      ...this._comments.slice(indexComment + 1),
    ];

    this._notify(updateType, updateFilm);
  }

  static adaptFilmToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        id: film['id'],
        name: film['film_info']['title'],
        altName: film['film_info']['alternative_title'],
        poster: film['film_info']['poster'],
        description: film['film_info']['description'],
        releaseDate: film['film_info']['release']['date'] !== null ? new Date(film['film_info']['release']['date']) : null,
        rating: film['film_info']['total_rating'],
        duration: film['film_info']['runtime'],
        genres: film['film_info']['genre'],
        ageLimit: film['film_info']['age_rating'],
        director: film['film_info']['director'],
        writers: film['film_info']['writers'],
        actors: film['film_info']['actors'],
        country: film['film_info']['release']['release_country'],
        status: {
          isWatchList: film['user_details']['watchlist'],
          isHistory: film['user_details']['already_watched'],
          isFavorite: film['user_details']['favorite'],
        },
        watchingDate: film['user_details']['watching_date'] !== null ? new Date(film['user_details']['watching_date']) : null,
        commentsId: film['comments'],
      },
    );

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];
    delete adaptedFilm['comments'];

    return adaptedFilm;
  }

  static adaptFilmToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'id': film.id,
        'film_info': {
          'poster': film.poster,
          'title': film.name,
          'alternative_title': film.altName,
          'total_rating': film.rating,
          'director': film.director,
          'writers': film.writers,
          'actors': film.actors,
          'release': {
            'date': film.releaseDate,
            'release_country': film.country,
          },
          'runtime': film.duration,
          'genre': film.genres,
          'description': film.description,
          'age_rating': film.ageLimit,
        },
        'user_details': {
          'watchlist': film.status.isWatchList,
          'already_watched': film.status.isHistory,
          'favorite': film.status.isFavorite,
          'watching_date': film.watchingDate,
        },
        'comments': film.commentsId,
      },
    );

    delete adaptedFilm.poster;
    delete adaptedFilm.name;
    delete adaptedFilm.altName;
    delete adaptedFilm.rating;
    delete adaptedFilm.director;
    delete adaptedFilm.writers;
    delete adaptedFilm.actors;
    delete adaptedFilm.release;
    delete adaptedFilm.duration;
    delete adaptedFilm.country;
    delete adaptedFilm.genres;
    delete adaptedFilm.age;
    delete adaptedFilm.isInWatchlist;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.isInFavorites;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.commentsId;

    return adaptedFilm;
  }

  static adaptCommentToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        message: comment['comment'],
      },
    );

    delete adaptedComment['comment'];

    return adaptedComment;
  }

  static adaptCommentToServer(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        'comment': comment.message,
      },
    );

    delete adaptedComment.message;

    return adaptedComment;
  }
}
