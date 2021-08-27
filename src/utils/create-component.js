export const pastePoints = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterEnd,',
};

export const createComponent = (wrap, content, point = pastePoints.BEFOREEND) => {
  wrap.insertAdjacentHTML(point, content);
};
