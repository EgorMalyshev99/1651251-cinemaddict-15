import AbstractView from './abstract';

const createMainNav = (filmsList) => {
  const status = {
    watchList: filmsList.filter((film) => film.status.isWatchList).length,
    history: filmsList.filter((film) => film.status.isHistory).length,
    favorites: filmsList.filter((film) => film.status.isFavorite).length,
  };

  return `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${status.watchList}</span></a>
        <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${status.history}</span></a>
        <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${status.favorites}</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createMainNav(this._films);
  }
}
