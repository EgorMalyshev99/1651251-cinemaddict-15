import AbstractView from './abstract.js';

const createCommentsList = (comments) => `<h3 class="film-details__comments-title">Comments: <span class="film-details__comments-count">${comments.length}</span></h3>
    <ul class="film-details__comments-list"></ul>`;

export default class CommentsList extends AbstractView {
  getTemplate() {
    return createCommentsList();
  }
}
