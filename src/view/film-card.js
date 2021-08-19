export const createFilmCard = (film) => {
  let description = film.description;
  if (description.length >= 140) {
    description = `${description.slice(0, 140)  }...`;
  }

  let additionalLetter = '';
  if (film.commentsCount !== 1) {
    additionalLetter = 's';
  }

  const markup = `
    <article class="film-card">
      <h3 class="film-card__title">${film.name}</h3>
      <p class="film-card__rating">${film.rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${film.releaseDate.year}</span>
        <span class="film-card__duration">${film.duration}</span>
        <span class="film-card__genre">${film.genre}</span>
      </p>
      <img src="${film.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${film.description}</p>
      <a class="film-card__comments">${film.commentsCount} comment${additionalLetter}</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
      </div>
    </article>
  `;

  return markup;
};
