"use strict";

// переключение формы по табу
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
