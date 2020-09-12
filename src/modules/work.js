import projects from './../media/work/*/*.*';
import * as helpers from './helpers.js';
import Swiper, { Pagination } from 'swiper';

// configure Swiper to use modules
Swiper.use([Pagination]);

export function render() {


  let main = document.getElementById('main');
  let slideshowsContainer = document.createElement("div");
  slideshowsContainer.classList.add("slideshows-container");
  main.appendChild(slideshowsContainer);

  let slideshow = document.createElement("div");
  slideshow.classList.add('slideshow');
  slideshow.innerHTML = `
  <div class="slideshow__wrapper">
    <div class="slideshow__slide">Slide 1</div>
    <div class="slideshow__slide">Slide 2</div>
    <div class="slideshow__slide">Slide 3</div>
    <div class="slideshow__slide">Slide 4</div>
    <div class="slideshow__slide">Slide 5</div>
    <div class="slideshow__slide">Slide 6</div>
    <div class="slideshow__slide">Slide 7</div>
    <div class="slideshow__slide">Slide 8</div>
    <div class="slideshow__slide">Slide 9</div>
    <div class="slideshow__slide">Slide 10</div>
  </div>
  <div class="slideshow__pagination"></div>`;

  slideshowsContainer.appendChild(slideshow);

  let swiper = new Swiper('.slideshow', {

    mousewheel: true,
    wrapperClass: "slideshow__wrapper",
    slideClass: "slideshow__slide",
  
    pagination: {
      el: '.slideshow__pagination',
      bulletClass: 'slideshow__pagination-bullet',
      bulletActiveClass: 'slideshow__pagination-bullet-active'
    }
  });
}
