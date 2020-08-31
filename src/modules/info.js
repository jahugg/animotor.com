import textLeft from './../media/info/text-left.md';
import textRight from './../media/info/text-right.md';

export function render() {
    // invert colors
  document.getElementById('app').setAttribute('data-invert', '');

  let main = document.getElementById('main');
  main.innerHTML = `<div class="info">
    <article class="info__left">${textLeft}</article>
    <article class="info__right">${textRight}</article>
  </div>`;
}
