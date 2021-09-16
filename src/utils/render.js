import Abstract from '../view/abstract.js';

export const RenderPoints = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, markup, point = RenderPoints.BEFOREEND) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (markup instanceof Abstract) {
    markup = markup.getElement();
  }

  switch (point) {
    case RenderPoints.AFTERBEGIN:
      container.prepend(markup);
      break;
    case RenderPoints.BEFOREEND:
      container.append(markup);
      break;
  }
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export const createElement = (markup) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = markup;

  return newElement.firstChild;
};
