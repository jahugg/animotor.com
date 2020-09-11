import textLeft from './../media/info/text-left.md';
import textRight from './../media/info/text-right.md';

export function render() {
    // invert colors
  document.getElementById('app').setAttribute('data-invert', '');

  let main = document.getElementById('main');
  main.innerHTML = `<div class="info">
    <div class="info__left">
      <article>${textLeft}</article>
    </div>
    <div class="info__right">
      <article>${textRight}</article>
    </div>
  </div>`;
}
