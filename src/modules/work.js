import projects from './../media/work/*/*.*';
import projectMedia from './../media/work/*/*/*.*';
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

  let observer = new IntersectionObserver(lazyLoadProjects, options);

  function lazyLoadProjects(entries, observer) {
    entries.forEach((entry) => {
      // fill viewport with projects
      // and append new projects when intersection conditions are met
      if (entry.intersectionRatio === 1) {
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

  // create basic html structure
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
      // handling standard images
      if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png' || fileType === 'webp') {
        let picture = document.createElement('picture');
        picture.classList.add('slideshow__slide__picture');
        slide.appendChild(picture);

        let fileSet = createFilenameSet(filePath);

        picture.innerHTML = `
        <source data-srcset="${fileSet.webp[400]} 1x, ${fileSet.webp[800]} 2x" type="image/webp" media="(max-width: 500px)">
        <source data-srcset="${fileSet.min[400]} 1x, ${fileSet.min[800]} 2x" media="(max-width: 500px)">
        <source data-srcset="${fileSet.webp[600]} 1x, ${fileSet.webp[1200]} 2x" type="image/webp" media="(max-width: 700px)">
        <source data-srcset="${fileSet.min[600]} 1x, ${fileSet.min[1200]} 2x" media="(max-width: 700px)">
        <source data-srcset="${fileSet.webp[1200]}" type="image/webp">
        <source data-srcset="${fileSet.min[1200]}">
        <img data-src="${filePath}" alt="Image of project ${project[0]}" class="swiper-lazy">
        `;

        let preloader = document.createElement('div');
        preloader.classList.add('swiper-lazy-preloader');
        slide.appendChild(preloader);

      // handling GIF files
      } else if (fileType === 'gif') {
        let media = document.createElement('img');
        media.setAttribute('data-src', filePath);
        media.alt = `Image of project ${project[0]}`;
        media.classList.add('slideshow__slide__media', 'swiper-lazy');
        slide.appendChild(media);

      // unknown file type
      } else {
        console.error('invalid filetype');
      }

      observer.observe(slideshow);
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
        loadPrevNextAmount: 2,
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
    // swiper.on('lazyImageReady', (swiper, slideEl, imageEl) => {
    //   console.info('lazy image ready, slide:', slideEl.getAttribute('data-swiper-slide-index'));
    //   // add observer to slideshow after first image has been loaded
    //   if (!swiper.el.getAttribute('data-firstimg')) {
    //     swiper.el.setAttribute('data-firstimg', 'loaded');
    //     observer.observe(slideshow);
    //     console.info('observer added for', swiper.el.id);
    //   }
    // });

    // jump to next slide on click
    if (multipleImages) swiper.on('click', () => swiper.slideNext());

    // create filenames and fetch filepaths based on the root file name
    // used for responsive images <picture> tag
    function createFilenameSet(rootFileName) {
      // extract root name
      let re = new RegExp('[^.]*');
      let rootName = re.exec(rootFileName)[0];
      rootName = rootName.replace(/^\//g, '');

      // create fileset object
      let fileSet = {
        min: {},
        webp: {},
      };

      // collect filepaths for filenames
      const sizes = [400, 600, 800, 1200];

      // add jpg and png image paths
      for (let size of sizes) {
        let file = projectMedia[projectName].minified[rootName + '-' + size];
        let fileType = Object.keys(file)[0];
        let filePath = file[fileType];
        fileSet.min[size] = filePath;
      }
      // add webp image paths
      for (let size of sizes) {
        let file = projectMedia[projectName].webp[rootName + '-' + size];
        let fileType = Object.keys(file)[0];
        let filePath = file[fileType];
        fileSet.webp[size] = filePath;
      }

      return fileSet;
    }
  }
}
