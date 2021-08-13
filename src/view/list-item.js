export const filmsListItem = (heading) => {
  let extraClass;

  if (heading === 'All movies. Upcoming') {
    extraClass = '';
  } else {
    extraClass = 'films-list--extra';
  }

  const markup = `
    <section class="films-list ${extraClass}">
      <h2 class="films-list__title">${heading}</h2>
      <div class="films-list__container"></div>
    </section>
  `;

  return markup;
};
