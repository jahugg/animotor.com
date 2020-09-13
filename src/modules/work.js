import projects from './../media/work/*/*.*';
import * as helpers from './helpers.js';
import Swiper, { Pagination } from 'swiper';

// configure Swiper to use pagination
Swiper.use([Pagination]);

export function render() {
  sessionStorage.clear();

  let main = document.getElementById('main');
  let slideshowsContainer = document.createElement('div');
  slideshowsContainer.classList.add('slideshows-container');
  main.appendChild(slideshowsContainer);

  // iterate over projects
  for (let projectName in projects) {
    // check if multiple images
    let multipleImages = Object.keys(projects[projectName]).length > 1 ? true : false;
    let projectID = helpers.sanitizeString(projectName);

    // create slideshow
    let slideshow = document.createElement('div');
    slideshow.classList.add('slideshow');
    slideshow.id = projectID;
    slideshowsContainer.appendChild(slideshow);

    // create wrapper
    let slidesWrapper = document.createElement('div');
    slidesWrapper.classList.add('slideshow__wrapper');
    slideshow.appendChild(slidesWrapper);

    // iterate and add project files to slideshow
    for (let fileName in projects[projectName]) {
      for (let fileType in projects[projectName][fileName]) {
        let filepath = projects[projectName][fileName][fileType];
        let slide = document.createElement('div');
        slide.classList.add('slideshow__slide');
        slidesWrapper.appendChild(slide);

        // add media item
        if (fileType === 'jpg' || fileType === 'png' || fileType === 'gif') {
          let media = document.createElement('img');
          media.src = filepath;
          media.classList.add('slideshow__slide__media');
          slide.appendChild(media);
        }
      }
    }

    // create pagination
    if (multipleImages) {
      let pagination = document.createElement('div');
      pagination.classList.add('slideshow__pagination');
      slideshow.appendChild(pagination);
    }

    // initialize swiper instance
    let swiper = new Swiper(slideshow, {
      loop: multipleImages ? true : false,
      wrapperClass: 'slideshow__wrapper',
      slideClass: 'slideshow__slide',
      slidesPerView: 1,
      mousewheel: true,

      pagination: {
        el: '.slideshow__pagination',
        bulletClass: 'slideshow__pagination-bullet',
        bulletActiveClass: 'slideshow__pagination-bullet-active',
      },
    });

    // add click event for next slide
    if (multipleImages)
      slideshow.addEventListener('click', (e) => {
        swiper.slideNext();
      });
  }
}
