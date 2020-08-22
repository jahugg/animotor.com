import contentInfo from './../media/info/article.md';

export function render() {
    // invert colors
  document.getElementById('app').setAttribute('data-invert', '');

  let main = document.getElementById('main');
  main.innerHTML = `<article class="info">` + contentInfo + `</article>`;
}
