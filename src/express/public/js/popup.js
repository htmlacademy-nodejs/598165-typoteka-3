"use strict";

const body = document.body;
enableScrolling();

const headerRegistrationLink = document.querySelector(`.header__registration`);
const headerEnterLink = document.querySelector(`.header__enter`);

headerRegistrationLink.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  showPopup(`register`);
});
headerEnterLink.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  showPopup(`log-in`);
});

function showPopup(name) {
  let modal = document.querySelector(`.modal`);
  modal.classList.remove(`js-hidden`);
  modal.classList.add(`js-shown`);

  if (modal && modal.classList.contains(`js-shown`)) {
    disableScrolling()
    setActiveTab(name);
    tabSwitching();

    const closeButton = document.querySelector(`.button--popup-close`);
    closeButton.addEventListener(`click`, () => {
      modal.classList.add(`js-hidden`);
      modal.classList.remove(`js-shown`);
      enableScrolling();
    })
  }
}

function setActiveTab(name) {
  const tabs = document.querySelectorAll(`.popup__tab`);
  const forms = document.querySelectorAll(`.popup__form`)

  tabs.forEach((tab) => tab.classList.remove(`popup__tab--active`));
  forms.forEach((form) => {
    form.classList.remove(`popup__form--active`);
    form.classList.add(`popup__form--hidden`);
  });
  document.querySelector(`.popup__tab--${name}`).classList.add(`popup__tab--active`);

  document.querySelector(`.form--${name}`).classList.remove(`popup__form--hidden`);
  document.querySelector(`.form--${name}`).classList.add(`popup__form--active`);
}

function tabSwitching() {
  let popup = document.querySelector('.popup');
  if (popup) {
    let tabs = popup.querySelectorAll('.popup__tab');

    if (tabs) {
      let tabForms = popup.querySelectorAll('.popup__form');
      let activeTab = popup.querySelector('.popup__tab--active');
      let activeForm = popup.querySelector('.popup__form--active');
      for (let i = 0; i < tabs.length; i++) {
        let tab = tabs[i];
        let form = tabForms[i];
        tab.addEventListener('click', (evt) => {
          if (evt.target.classList.contains('popup__tab-switcher') && evt.currentTarget !== activeTab) {
            activeTab.classList.remove('popup__tab--active');
            tab.classList.add('popup__tab--active');
            activeTab = tab;
            activeForm.classList.remove('popup__form--active');
            activeForm.classList.add('popup__form--hidden');
            form.classList.add('popup__form--active');
            form.classList.remove('popup__form--hidden');
            activeForm = form;
          }
        });
      }
    }
  }
}

function enableScrolling() {
  body.removeAttribute("style");
  body.classList.remove("body-fixed");
}

function disableScrolling() {
  var scrollWidth = getScrollbarWidth();
  body.setAttribute('style', 'padding-right: ' + scrollWidth + 'px;');
  body.classList.add('body-fixed');
}

function getScrollbarWidth() {
  var outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll";
  outer.style.msOverflowStyle = "scrollbar";
  body.appendChild(outer);
  var inner = document.createElement("div");
  outer.appendChild(inner);
  var scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  return scrollbarWidth;
}
