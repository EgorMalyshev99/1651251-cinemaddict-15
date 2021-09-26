import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

export const getGenreStat = (films) => {
  const genreArray = films.map((film) => film.genres);
  const genres = [];
  genreArray.forEach((film) => {
    film.forEach((genre)=>{
      genres.push(genre);
    });
  });

  const genreStats = {};
  genres.forEach((genre) => {
    const value = films.filter((film) => film.genres.includes(genre));
    const genreItem = { [genre] : value.length};
    Object.assign(genreStats, genreItem);
  });
  return genreStats;
};

export const getFavoriteGenre = (genreStatistic) => {
  let favoriteGenre;
  for (const key in genreStatistic) {
    if (!favoriteGenre || genreStatistic[key] > favoriteGenre) {
      favoriteGenre = key;
    }
  }
  return favoriteGenre;
};

const daysToToday = 0;
const daysToFullWeek = 6;
const monthsToDate = 1;
const yearsToDate = 1;

const isIncluded = (film, from, type) => {
  const dateTo = dayjs().toDate();
  const dateFrom = dayjs().subtract(from, type).toDate();
  if (
    dayjs(film.watchingDate).isSame(dateFrom) ||
    dayjs(film.watchingDate).isBetween(dateFrom, dateTo) ||
    dayjs(film.watchingDate).isSame(dateTo)
  ) {
    return film;
  }
};

export const filterStatistics = {
  ['statistic-all-time']: (films) => films.filter((film) => film),
  ['statistic-today']: (films) => films.filter((film) => isIncluded(film, daysToToday, 'day')),
  ['statistic-week']: (films) => films.filter((film) => isIncluded(film, daysToFullWeek, 'day')),
  ['statistic-month']: (films) => films.filter((film) => isIncluded(film, monthsToDate, 'month')),
  ['statistic-year']: (films) => films.filter((film) => isIncluded(film, yearsToDate, 'year')),
};
