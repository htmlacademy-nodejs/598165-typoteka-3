"use strict";

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const UPDATING_ITEMS_NUMBER = 4;
  const TRUNCATED_TEXT_LENGTH = 100;

  const socket = io(SERVER_URL);

  const createLastCommentElement = (comment) => {
    const lastCommentTemplate = document.querySelector('#last-comment-template');
    const lastCommentElement = lastCommentTemplate.cloneNode(true).content;

    if (comment['users.avatar']) {
      const avatar = lastCommentElement.querySelector(`.last__list-image`)
      avatar.src = `img/${comment['users.avatar']}`;
      avatar.width = 20;
      avatar.height = 20;
      avatar.alt = `Аватар пользователя`;
    }

    lastCommentElement.querySelector(`.last__list-name`)
      .innerText = `${comment['users.firstName']} ${comment['users.lastName']}`;

    const link = lastCommentElement.querySelector(`.last__list-link`);
    link.href = `/articles/${comment['articleId']}`;
    link.innerText = truncateText(comment.text, TRUNCATED_TEXT_LENGTH);
    link.innerHTML += `&nbsp...`;

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
    popularListLink.innerText = truncateText(popular.announce, TRUNCATED_TEXT_LENGTH);
    popularListLink.innerHTML += `&nbsp...`;
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
    lastCommentsList.prepend(createLastCommentElement(comment));
  };

  const truncateText = (text, n) => {
    return text.length > n
      ? text.slice(0, TRUNCATED_TEXT_LENGTH).slice(0, text.lastIndexOf(` `))
      : text;
  };


  socket.addEventListener('comment:create', (comment, populars) => {
    console.log(populars);
    updateLastComments(comment);
    updatePopularElements(populars);
  })
})();
