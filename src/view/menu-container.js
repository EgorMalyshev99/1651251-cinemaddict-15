import AbstractView from './abstract.js';

const createMenuContainer = () => '<nav class="main-navigation"></nav>';

export default class MenuContainer extends AbstractView {

  getTemplate() {
    return createMenuContainer();
  }
}
