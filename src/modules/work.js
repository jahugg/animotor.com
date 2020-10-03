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

  // sort projects by name
  let projectsSorted = Object.entries(projects).sort();
  for (let project of projectsSorted) {
    // sort project images by filename
    let imagesSorted = Object.values(project[1]).sort((a, b) => {
      let keyA = Object.keys(a);
      let keyB = Object.keys(b);
      return a[keyA].localeCompare(b[keyB]);
    });

    project[1] = imagesSorted;
  }

  for (let project of projectsSorted) {
    let projectName = project[0];
    let multipleImages = project[1].length > 1 ? true : false;
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

    // iterate project files
    for (let fileObject of project[1]) {
      let fileType = Object.keys(fileObject)[0];
      let filePath = fileObject[fileType];

      let slide = document.createElement('div');
      slide.classList.add('slideshow__slide');
      slidesWrapper.appendChild(slide);

      // add media item
      if (fileType === 'jpg' || fileType === 'png' || fileType === 'gif' || fileType === 'jpeg') {
        let media = document.createElement('img');
        media.src = filePath;
        media.alt = `Image ${filePath} of project${project[0]}`;
        media.setAttribute('loading', 'lazy');
        media.classList.add('slideshow__slide__media');
        slide.appendChild(media);
      }

      // add media item using lazy load
      // if (fileType === 'jpg' || fileType === 'png' || fileType === 'gif' || fileType === 'jpeg') {
      //   let media = document.createElement('img');
      //   // media.src = filePath;
      //   media.setAttribute('data-src', filePath);
      //   media.alt = `Image ${filePath} of project ${project[0]}`;
      //   media.classList.add('slideshow__slide__media', 'swiper-lazy');
      //   slide.appendChild(media);

      //   let preloader = document.createElement('div');
      //   preloader.classList.add('swiper-lazy-preloader');
      //   slide.appendChild(preloader);
      // }
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

      // enable lazy loading images
      // preloadImages: false,
      // lazy: true,

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
