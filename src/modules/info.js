import article from './../media/info/article.md';

export function render() {
    // invert colors
  document.getElementById('app').setAttribute('data-invert', '');

  let main = document.getElementById('main');
  main.innerHTML = `<div class="info">
    <article>${article}</article>
  </div>`;
}
