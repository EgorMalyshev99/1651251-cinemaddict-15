export const filmsListItem = (heading) => {
  let classExtra;
  let classHidden;

  if (heading === 'All movies. Upcoming') {
    classExtra = '';
    classHidden = 'visually-hidden';
  } else {
    classExtra = 'films-list--extra';
  }

  return `
    <section class="films-list ${classExtra}">
      <h2 class="films-list__title ${classHidden}">${heading}</h2>
      <div class="films-list__container"></div>
    </section>
  `;
};
