"use strict";

(() => {
  const UPDATING_ITEMS_NUMBER = 4;
  const TRUNCATED_TEXT_LENGTH = 100;

  const socket = io(window.location.origin);

  const createCommentElement = (comment) => {
    const lastCommentTemplate = document.querySelector('#last-comment-template');
    const lastCommentElement = lastCommentTemplate.cloneNode(true).content;

    const avatar = lastCommentElement.querySelector(`.last__list-image`)
    if (comment['users.avatar']) {
      avatar.src = `img/${comment['users.avatar']}`;
    } else {
      avatar.src = `img/icons/smile.svg`
    }

    lastCommentElement.querySelector(`.last__list-name`)
      .innerText = `${comment['users.firstName']} ${comment['users.lastName']}`;

    const link = lastCommentElement.querySelector(`.last__list-link`);
    link.href = `/articles/${comment['articles.id']}`;
    truncateText(link, comment.text, TRUNCATED_TEXT_LENGTH);

    return lastCommentElement;
  };

  const updatePopularElements = (popularItems) => {
    const popularList = document.querySelector('.hot__list');
    popularList.innerHTML = ``;
    popularItems.forEach((popular) => {
      popularList.append(createPopularElement(popular));
    })
  };

  const createPopularElement = (popular) => {
    const popularTemplate = document.querySelector('#popular-template');
    const popularElement = popularTemplate.cloneNode(true).content;

    const popularListLink = popularElement.querySelector('.hot__list-link');
    popularListLink.href = `articles/${popular.id}`;
    truncateText(popularListLink, popular.announce, TRUNCATED_TEXT_LENGTH);
    const sup = document.createElement(`sup`);
    sup.classList.add(`hot__link-sup`);
    sup.innerText = popular[`comments-count`]
    popularListLink.append(sup);

    return popularElement;
  };

  const updateLastComments = (comment) => {
    const lastCommentsList = document.querySelector(`.last__list`);
    const lastCommentsItems = lastCommentsList.querySelectorAll(`.last__list-item`);

    if (lastCommentsItems.length === UPDATING_ITEMS_NUMBER) {
      lastCommentsItems[UPDATING_ITEMS_NUMBER - 1].remove();
    }
    lastCommentsList.prepend(createCommentElement(comment));
  };

  const updateDeleteComments = (comments) => {
    const lastCommentsList = document.querySelector(`.last__list`);
    lastCommentsList.innerHTML = ``;
    comments.forEach((comment) => {
      lastCommentsList.append(createCommentElement(comment));
    })
  };


  const truncateText = (el, text, n) => {
    if (text.length > n) {
      text = text.slice(0, TRUNCATED_TEXT_LENGTH);
      text = text.slice(0, text.lastIndexOf(` `));
      el.innerText = text;
      el.innerHTML += `&nbsp;...`
    } else {
      el.innerText = text;
    }
  };

  socket.addEventListener('comment:create', (comment, populars) => {
    updateLastComments(comment);
    updatePopularElements(populars);
  })

  socket.addEventListener('comment:delete', (comments, populars) => {
    updateDeleteComments(comments)
    updatePopularElements(populars);
  })
})();
