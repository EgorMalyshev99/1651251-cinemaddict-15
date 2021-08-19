import dayjs from 'dayjs';
import {
  ACTORS,
  AGE_LIMIT,
  COMMENTS,
  COUNTRY,
  DESCRIPTIONS,
  DIRECTORS,
  EMOJI,
  FILM_NAMES,
  GENRES,
  NAMES,
  POSTER_PATHS,
  WRITERS
} from '../data';
import {
  getRandomInteger
} from '../utils/get-random-integer';
import {
  getRandomReal
} from '../utils/get-random-real';
import {
  getRandomItem
} from '../utils/get-random-item';
import {
  getSomeItems
} from '../utils/get-some-items';

const MIN_COMMENTS = 0;
const MAX_COMMENTS = 5;

const generateCommentDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(0, maxDaysGap);
  const date = dayjs().subtract(daysGap, 'day').format('YYYY/MM/DD hh:mm');

  return date;
};

const generateDateOfRelease = () => {
  const maxYearsGap = 50;
  const yearsGap = getRandomInteger(0, maxYearsGap);
  const year = dayjs().subtract(yearsGap, 'year').format('YYYY');
  const month = dayjs().format('MMMM');
  const day = dayjs().format('DD');
  const currentDate = dayjs().format('DD MMMM YYYY');

  const date = {
    year: year,
    mounth: month,
    day: day,
    fullDate: currentDate,
  };

  return date;
};

const generateFilmDuration = () => {
  const duration = `${getRandomInteger(1,2)}h ${getRandomInteger(0, 60)}m`;

  return duration;
};

const createComment = () => {
  const comment = {
    author: getRandomItem(NAMES),
    text: getRandomItem(COMMENTS),
    date: generateCommentDate(),
    emoji: getRandomItem(EMOJI),
  };

  return comment;
};

const generateComments = () => {
  const comments = [];
  const commentsCount = getRandomInteger(MIN_COMMENTS, MAX_COMMENTS);

  for (let index = 1; index <= commentsCount; index++) {
    comments.push(createComment());
  }

  const commentsData = {
    comments: comments,
    length: commentsCount,
  };

  return commentsData;
};

export const generateFilm = () => {
  const currentComments = generateComments();
  const film = {
    name: getRandomItem(FILM_NAMES),
    poster: getRandomItem(POSTER_PATHS),
    description: getRandomItem(DESCRIPTIONS),
    comments: currentComments.comments,
    commentsCount: currentComments.length,
    releaseDate: generateDateOfRelease(),
    rating: getRandomReal(1, 10, 1),
    duration: generateFilmDuration(),
    genre: getRandomItem(GENRES),
    ageLimit: getRandomItem(AGE_LIMIT),
    director: getRandomItem(DIRECTORS),
    writers: getSomeItems(WRITERS, getRandomInteger(1, 3)),
    actors: getSomeItems(ACTORS, getRandomInteger(3, 5)),
    country: getRandomItem(COUNTRY),
    status: {
      isWatchList: Boolean(getRandomInteger(0, 1)),
      isHistory: Boolean(getRandomInteger(0, 1)),
      isFavorite: Boolean(getRandomInteger(0, 1)),
    },
  };

  return film;
};
