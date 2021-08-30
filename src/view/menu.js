export const createMainNav = (filmsList) => {
  const status = {
    all: filmsList.length,
    watchList: filmsList.filter((film) => film.status.isWatchList).length,
    history: filmsList.filter((film) => film.status.isHistory).length,
    favorites: filmsList.filter((film) => film.status.isFavorite).length,
  };

  return `
    <nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies: ${status.all}</a>
        <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${status.watchList}</span></a>
        <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${status.history}</span></a>
        <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${status.favorites}</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>
  `;
};
