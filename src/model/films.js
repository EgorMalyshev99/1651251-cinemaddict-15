import AbstractObserver from '../utils/abstract-observer.js';

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
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
        'film_info': {
          'poster': film.poster,
          'title': film.name,
          'alternative_title': film.altName,
          'total_rating': film.rating,
          'director': film.director,
          'writers': film.writers,
          'actors': film.actors,
          'release': {
            'date': film.release instanceof Date ? film.release.toISOString() : null,
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
          'watching_date': film.watchingDate instanceof Date ? film.watchingDate.toISOString() : null,
        },
        'comments': film.commentsId,
      },
    );

    delete adaptedFilm.poster;
    delete adaptedFilm.title;
    delete adaptedFilm.originalTitle;
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
    delete adaptedFilm.isCommentDisabled;
    delete adaptedFilm.isCommentDeleting;
    delete adaptedFilm.commentDeleteId;

    return adaptedFilm;
  }

  // static adaptCommentToClient(comment) {
  //   const adaptedComment = Object.assign(
  //     {},
  //     comment,
  //     {
  //       message: comment['comment'],
  //     },
  //   );

  //   delete adaptedComment['comment'];

  //   return adaptedComment;
  // }

  // static adaptCommentToServer(comment) {
  //   const adaptedComment = Object.assign(
  //     {},
  //     comment,
  //     {
  //       'comment': comment.message,
  //     },
  //   );

  //   delete adaptedComment.message;

  //   return adaptedComment;
  // }
}
