export const PASTE_POINTS = {
  beforeBegin: 'beforebegin',
  afterBegin: 'afterbegin',
  beforeEnd: 'beforeend',
  afterEnd: 'afterEnd,',
};

export const createComponent = (wrap, content, point = PASTE_POINTS.beforeEnd) => {
  wrap.insertAdjacentHTML(point, content);
};
