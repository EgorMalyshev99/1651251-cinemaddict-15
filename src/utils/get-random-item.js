import {
  getRandomInteger
} from './get-random-integer';

export const getRandomItem = (arr) => {
  const randomIndex = getRandomInteger(0, arr.length - 1);

  return arr[randomIndex];
};
