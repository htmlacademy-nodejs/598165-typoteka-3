'use strict';

const crypto = require(`crypto`);

class CommentService {

  findAll(article) {
    return article.comments;
  }

  create(article, comment) {
    const newComment = Object.assign({
      id: crypto.randomUUID(),
    }, comment);

    article.comments.push(newComment);
    return comment;
  }

  drop(article, commentId) {

    const dropComment = article.comments
      .find((comment) => comment.id === commentId);

    if (!dropComment) {
      return null;
    }

    article.comments = article.comments.filter((comment) => comment.id !== commentId);

    return dropComment;
  }
}

module.exports = CommentService;
