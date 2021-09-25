const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';
const isEnterEvent = (evt) => evt.key === '13' || evt.key === 'Enter';


export {
  isEscEvent,
  isEnterEvent
};
