import projects from './../media/work/*/*.*';
import * as helpers from './helpers.js';
import Swiper, { Pagination, Lazy } from 'swiper';

// configure Swiper to use pagination
Swiper.use([Pagination, Lazy]);

export function render() {
  sessionStorage.clear();

  // create intersection observer for lazy loading projects
  let options = {
    root: null,
    rootMargin: '0px 0px 200% 0px',
    threshold: 1,
  };

  let observer = new IntersectionObserver(handleProjects, options);

  function handleProjects(entries, observer) {
    entries.forEach((entry) => {
      // fill viewport with projects
      // and append new projects when intersection conditions are met
      if (entry.intersectionRatio === 1) {
        console.log(entry.target.id, 'loaded');

        //stop observing this object
        observer.unobserve(entry.target);

        // determine next project by child node count
        let index = slideshowsContainer.childElementCount;
        let projectCount = Object.keys(projects).length;
        if (index < projectCount) appendProject(index);
        else observer.disconnect();
      }
    });
  }

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

  // add first project manually to get started and trigger
  // the intersection observer
  appendProject(0);

  function appendProject(index) {
    let project = projectsSorted[index];

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

      // add media item using swipers lazy load functionality
      if (fileType === 'jpg' || fileType === 'png' || fileType === 'gif' || fileType === 'jpeg' || fileType === 'webp') {
        let media = document.createElement('img');
        media.setAttribute('data-src', filePath);
        media.setAttribute('data-srcset', filePath + ' 2x');
        media.alt = `Image ${filePath} of project ${project[0]}`;
        media.classList.add('slideshow__slide__media', 'swiper-lazy');
        slide.appendChild(media);

        let preloader = document.createElement('div');
        preloader.classList.add('swiper-lazy-preloader');
        preloader.innerHTML = 'HALLO';
        slide.appendChild(preloader);
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
      preloadImages: false,
      lazy: {
        loadPrevNext: true,
      },
      loop: multipleImages ? true : false,
      wrapperClass: 'slideshow__wrapper',
      slideClass: 'slideshow__slide',

      pagination: {
        el: '.slideshow__pagination',
        bulletClass: 'slideshow__pagination-bullet',
        bulletActiveClass: 'slideshow__pagination-bullet-active',
      },
    });

    // adding custom slideshow events
    /* register intersection observer after first image has 
      been loaded to lazy load next slideshows */
    swiper.on('lazyImageReady', (event) => {
      // add observer after first image has been loaded
      if (!event.el.getAttribute('data-firstimg')) {
        event.el.setAttribute('data-firstimg', 'loaded');
        observer.observe(slideshow);
      }
    });

    // jump to next slide on click
    if (multipleImages) swiper.on('click', () => swiper.slideNext());
  }
}
