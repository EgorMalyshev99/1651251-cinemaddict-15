import {
  shuffleArray
} from './shuffle-array';

export const getSomeItems = (arr = [], number = 0) => {
  const newArray = arr.slice();
  if (number > newArray.length) {
    number = newArray.length;
  }

  shuffleArray(newArray);

  return newArray.slice(0, number);
};
