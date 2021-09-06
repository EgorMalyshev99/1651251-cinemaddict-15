import AbstractView from './abstract';

const createMoreBtn = () => ('<button class="films-list__show-more">Show more</button>');

export default class MoreBtn extends AbstractView {
  getTemplate() {
    return createMoreBtn();
  }
}
