export const addVisibleLogicToElements = (buttons, elements) => {
  buttons;
  elements;
  buttons.forEach((btn, index) => {
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => {
      elements[index].classList.remove('visually-hidden');
    });
  });
};
