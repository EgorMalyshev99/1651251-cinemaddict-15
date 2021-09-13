import CommentsListContainerView from '../view/comments-list.js';
import CommentView from '../view/comment.js';
import {
  render
} from '../utils/render.js';

export default class CommentsList {
  constructor(container) {
    this._container = container;
    this._commentsListContainerComponent = CommentsListContainerView();
    this._commentComponent = null;
  }

  init(comments) {
    this._currentComments = comments.slice();
  }

  _renderCommentsContainer() {
    render(this._container, this._commentsListContainerComponent);
  }

  _createComment(comment) {
    this._commentComponent = CommentView(comment);
  }

  _renderComments() {
    this._currentComments.forEach((comment) => {
      this._createComment(comment);
      render(this._commentsListContainerComponent.querySelector('.film-details__comments-list'), this._commentComponent);
    });
  }
}
