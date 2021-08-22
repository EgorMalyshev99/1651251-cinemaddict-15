import {
  PASTE_POINTS
} from '../data';

const {
  beforeEnd,
} = PASTE_POINTS;


export const createComponent = (wrap, content, point = beforeEnd) => {
  wrap.insertAdjacentHTML(point, content);
};
