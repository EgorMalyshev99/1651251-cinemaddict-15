export const pastePoints = {
  beforeBegin: 'beforebegin',
  afterBegin: 'afterbegin',
  beforeEnd: 'beforeend',
  afterEnd: 'afterEnd,',
};

export const createComponent = (wrap, content, point = pastePoints.beforeEnd) => {
  wrap.insertAdjacentHTML(point, content);
};
