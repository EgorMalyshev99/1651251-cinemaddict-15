import dayjs from 'dayjs';

export const sortFilmDate = (filmA, filmB) => dayjs(filmA.releaseDate.fullDate).diff(dayjs(filmB.releaseDate.fullDate));

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
