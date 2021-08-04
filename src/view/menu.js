import {
  createComponent
} from "../main";

const mainWrap = document.querySelector('.main');
const mainNav = document.createElement('nav');
mainNav.className = 'main-navigation';
mainNav.innerHTML = `
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">13</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">4</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">8</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
`

let position = 'start';

createComponent(mainWrap, mainNav, position);
