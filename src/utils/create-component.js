export const RenderPoints = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, markup, point = RenderPoints.BEFOREEND) => {
  switch (point) {
    case RenderPoints.AFTERBEGIN:
      container.prepend(markup);
      break;
    case RenderPoints.BEFOREEND:
      container.append(markup);
      break;
  }
};

export const createElement = (markup) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = markup;

  return newElement.firstChild;
};
