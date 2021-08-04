export const createComponent = (wrap, content, point) => {
  if (point === 'start') {
    wrap.prepend(content);
  }

  if (point === 'end') {
    wrap.append(content);
  }
}
