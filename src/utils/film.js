import dayjs from 'dayjs';
import { MINUTES_IN_HOUR } from '../const';

export const sortFilmDate = (filmA, filmB) => dayjs(filmA.releaseDate).diff(dayjs(filmB.releaseDate));

export const sortFilmRating = (filmA, filmB) => {
  if (filmA.rating > filmB.rating) {
    return 1;
  } // если первое значение больше второго
  if (filmA.rating === filmB.rating) {
    return 0;
  } // если равны
  if (filmA.rating < filmB.rating) {
    return -1;
  } // если первое значение меньше второго
};

export const durationFilm = (duration = 0) => {
  if ((duration >= MINUTES_IN_HOUR) && ((duration % MINUTES_IN_HOUR) === 0)) {
    const hours = parseInt((duration / MINUTES_IN_HOUR), 10);
    return `${hours}h`;
  } else if (duration > MINUTES_IN_HOUR && ((duration % MINUTES_IN_HOUR) !== 0)) {
    const hours = parseInt((duration / MINUTES_IN_HOUR), 10);
    const minutes = duration % MINUTES_IN_HOUR;
    return `${hours}h ${minutes}m`;
  }

  return `${duration}m`;
};

export const getPopupData = (film, commentsList) => {
  const filmCommentsId = film.commentsId;
  const filmComments = [];
  filmCommentsId.forEach((commentId) => {
    commentsList.forEach((comment) => {
      if (comment.id === commentId) {
        filmComments.push(comment);
      }
    });
  });

  return [film, filmComments];
};
