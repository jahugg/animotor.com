import "./fonts.less";
import "./styles.less";
import projects from "./media/*/*.*";
import animation from "./animation/*.*";
import contentInfo from "./content-info.md";

const pages = {
  home: {
    title: "Animotor",
    slug: "/",
    loadContents: function () { loadHome() }
  },
  work: {
    title: "Work",
    slug: "/work",
    loadContents: function () { loadWork() }
  },
  info: {
    title: "Info",
    slug: "/info",
    loadContents: function () { loadInfo() }
  }
};
const defaultPage = pages.home;

function initApp() {
  buildNavigation();
  navigateToCurrentURL();

  // handle history pop state events
  window.addEventListener('popstate', (event) => {
    let stateObj = { slug: event.state.slug };
    buildPage(stateObj, false);
  });
}

function navigateToCurrentURL() {

  // read slug from url
  let urlPath = window.location.pathname;

  // check slug for validity
  let currentPage = defaultPage;
  for (let key in pages)
    if (pages[key].slug === urlPath)
      currentPage = pages[key];

  // create state object
  let stateObj = { slug: currentPage.slug };

  // build page
  buildPage(stateObj, true);
}

function buildNavigation() {
  let app = document.getElementById("app");
  let nav = document.createElement("nav");
  nav.id = "nav";
  app.appendChild(nav);
  let list = document.createElement("ul");
  nav.appendChild(list);

  for (let key in pages) {
    let item = document.createElement("li");
    let link = document.createElement("a");
    link.href = pages[key].slug;
    link.setAttribute("data-link", "");
    link.innerHTML = pages[key].title;
    item.appendChild(link);
    list.appendChild(item);

    link.addEventListener("click", handlePageLink);
  }
}

function buildPage(stateObj, addToHistory) {

  // check if main exists
  let main = document.getElementById("main");
  if (main) // empty main
    main.innerHTML = "";

  else { // create main
    main = document.createElement("main");
    main.id = "main";
    app.appendChild(main);
  }

  // fetch matching page object
  let currentPage;
  for (let key in pages)
    if (pages[key].slug === stateObj.slug)
      currentPage = pages[key];

  // set page title
  let title = "Animotor";
  if (currentPage !== defaultPage) title += " - " + currentPage.title;
  document.title = title;

  // push page into browser history
  if (addToHistory)
    window.history.pushState(stateObj, currentPage.title, currentPage.slug);

  // update navigation
  updateNavigation(currentPage.slug);

  // load page contents
  // consider this workflow https://parceljs.org/code_splitting.html
  currentPage.loadContents();
}

function updateNavigation(currentSlug) {
  // handle navigation items
  let links = document.querySelectorAll('nav a');
  for (let link of links)
    link.removeAttribute("data-active");

  // set link for current page as active
  document.querySelector('a[href="' + currentSlug + '"]').setAttribute("data-active", "");
}

function handlePageLink(event) {
  event.preventDefault();
  let target = event.target;
  let stateObj = { slug: target.getAttribute("href") }; // create state object
  buildPage(stateObj, true);
}

function loadInfo() {
  let main = document.getElementById("main");
  main.innerHTML = `<article class="info">` + contentInfo + `</article>`;
}

function loadWork() {
  let main = document.getElementById("main");

  // iterate over projects
  for (let projectName in projects) {

    // check if multiple images
    let multipleImages = (Object.keys(projects[projectName]).length > 1) ? true : false;

    // create slideshow
    let slideshow = document.createElement("div");
    slideshow.classList.add("slideshow");
    main.appendChild(slideshow);

    let slidesWrapper = document.createElement("div");
    slidesWrapper.classList.add("slideshow__slides-wrapper");
    slideshow.appendChild(slidesWrapper);

    // add event to handle end of scrolling
    let isScrolling;
    slidesWrapper.addEventListener("scroll", function (event) {

      // Clear our timeout throughout the scroll
      window.clearTimeout(isScrolling);

      // Set a timeout to run after scrolling ends
      isScrolling = setTimeout(function () {

        // Run the callback
        let index = Math.round(event.target.scrollLeft / event.target.offsetWidth);
        let slideshow = event.target.closest(".slideshow");
        let indicator = slideshow.querySelector(".slideshow__indicators-wrapper").children[index];
        updateIndicators(indicator);

      }, 10);

    }, false);

    let indicatorsWrapper;
    if (multipleImages) {

      // create navigation items
      let navigation = document.createElement("div");
      navigation.classList.add("slideshow__nav");
      slideshow.appendChild(navigation);

      let prevButton = document.createElement("button");
      prevButton.classList.add("slideshow__nav__btn");
      navigation.appendChild(prevButton);
      prevButton.addEventListener("click", previousSlide);

      let nextButton = document.createElement("button");
      nextButton.classList.add("slideshow__nav__btn");
      navigation.appendChild(nextButton);
      nextButton.addEventListener("click", nextSlide);

      // create indicators wrapper
      indicatorsWrapper = document.createElement("div");
      indicatorsWrapper.classList.add("slideshow__indicators-wrapper");
      slideshow.appendChild(indicatorsWrapper);
    }


    // iterate over project files
    for (let fileName in projects[projectName]) {
      for (let fileType in projects[projectName][fileName]) {
        let filepath = projects[projectName][fileName][fileType];
        let mediaContainer = document.createElement("div");
        mediaContainer.classList.add("slideshow__slide");
        slidesWrapper.appendChild(mediaContainer);

        // add media item
        if (fileType === "jpg"
          || fileType === "png"
          || fileType === "gif") {
          let media = document.createElement("img");
          media.src = filepath;
          media.classList.add("slideshow__slide__media");
          mediaContainer.appendChild(media);
        }

        // add indicator
        if (multipleImages) {
          let indicatorItem = document.createElement("div");
          indicatorItem.classList.add("slideshow__indicator");
          indicatorItem.addEventListener("click", jumpToSlide);
          indicatorsWrapper.appendChild(indicatorItem);
        }
      }
    }

    // set first indicator active
    if (multipleImages)
      indicatorsWrapper.querySelector(".slideshow__indicator").setAttribute("data-active", "");
  }

  function jumpToSlide(event) {
    let target = event.target;
    let parent = target.closest(".slideshow__indicators-wrapper");
    let slideshow = target.closest(".slideshow");
    let slidesWrapper = slideshow.querySelector(".slideshow__slides-wrapper");

    // get index of child
    let targetIndex = Array.from(parent.children).indexOf(target);
    slidesWrapper.scrollTo({
      left: targetIndex * slideshow.offsetWidth,
      behavior: 'smooth'
    });
  };

  function updateIndicators(indicator) {
    let indicatorsWrapper = indicator.parentNode;

    // remove active attribute
    for (let indicator of indicatorsWrapper.children)
      indicator.removeAttribute("data-active");

    // indicatorsWrapper.children[index].setAttribute("data-active", "");
    indicator.setAttribute("data-active", "");
  }

  function previousSlide(event) {
    let slideshow = event.target.closest(".slideshow__slides-wrapper");
    slideshow.scrollTo({
      left: slideshow.scrollLeft - slideshow.offsetWidth,
      behavior: 'smooth'
    });
  }

  function nextSlide(event) {
    let slideshow = event.target.closest(".slideshow__slides-wrapper");
    slideshow.scrollTo({
      left: slideshow.scrollLeft + slideshow.offsetWidth,
      behavior: 'smooth'
    });
  }
}

function loadHome() {
  
  let lastTouchPosY;
  let endTouchPosY;
  let slowdownAnim;
  let scrollingAnim;

  // container
  let container = document.createElement("div");
  container.classList.add("infinite-scroll-container");
  container.innerHTML = "loading";
  main.appendChild(container);

  // preload all images
  let promises = [];
  for (let image in animation)
    for (let type in animation[image])
      promises.push(loadImage(animation[image][type]));

  // add animation scroller after images have been loaded
  Promise.all(promises)
    .then(initAnimationScroller)
    .catch(err => console.error(err));

  function initAnimationScroller(images) {

    // remove loading message
    container.innerHTML = "";

    // static animation frame
    let animKeys = Object.keys(animation);
    let staticAnim = document.createElement("div");
    staticAnim.classList.add("static-anim");
    container.appendChild(staticAnim);
    let frame = document.createElement("img");
    frame.src = animation[animKeys[0]]["png"];
    frame.setAttribute("data-id", 0);
    staticAnim.appendChild(frame);

    // infinite scroll
    let infiniteScroll = document.createElement("div");
    infiniteScroll.classList.add("infinite-scroll");
    container.appendChild(infiniteScroll);

    // fill screen with tiles
    while (infiniteScroll.scrollHeight <= window.innerHeight)
      appendItem();

    scrollingAnim = window.requestAnimationFrame(scrollingAnimation);

    function scrollingAnimation() { 
      setScrollPos(getScrollPos() + 1);
      scrollingAnim = window.requestAnimationFrame(scrollingAnimation);
    }

    // register event listeners
    container.addEventListener("wheel", throttledEvent(handleWheel, 5));
    container.addEventListener("touchstart", handleTouchStart, false);
    container.addEventListener("touchmove", throttledEvent(handleTouchMove, 5), false);
    container.addEventListener("touchend", handleTouchEnd, false);
    container.addEventListener("touchcancel", handleTouchEnd, false);

    // callback function to execute when mutations are observed
    const onScrollChange = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' &&
          mutation.attributeName === 'style') {

          let infiniteScroll = document.querySelector(".infinite-scroll");
          let translateY = getScrollPos();
          let firstChild = infiniteScroll.firstChild;
          let lastChild = infiniteScroll.lastChild;

          // remove first child if out of bounds
          if (Math.abs(translateY) > firstChild.offsetHeight) {
            firstChild.remove();
            infiniteScroll.style.transform = "translateY(0)";
          }
          // remove last child out of bounds
          else if (infiniteScroll.offsetHeight - lastChild.offsetHeight - Math.abs(translateY)
            > window.innerHeight)
            lastChild.remove();

          // prepend new child if top reached
          if (translateY > 0)
            prependItem();

          // append new child if bottom reached
          else if (window.innerHeight + Math.abs(translateY) > infiniteScroll.offsetHeight)
            appendItem();

          // ----------
          // handle static animation frame
          let items = document.getElementsByClassName("infinite-scroll__item");
          let staticContainer = document.querySelector(".static-anim");
          let staticRect = staticContainer.getBoundingClientRect();
          let closestItem;
          let lastDist = 9999;

          // find closest item
          for (let item of items) {
            let itemRect = item.getBoundingClientRect();
            let dist = Math.abs(itemRect.top - staticRect.top);

            if (dist < lastDist) {
              lastDist = dist;
              closestItem = item;
            }
          }

          // if closest item is above static apply image
          let closestRect = closestItem.getBoundingClientRect();

          if (closestRect.top <= staticRect.top) {
            let animKeys = Object.keys(animation);
            let staticImage = staticContainer.querySelector("img");
            let id = closestItem.getAttribute("data-id");
            staticImage.src = animation[animKeys[id]]["png"];
            staticImage.setAttribute("data-id", id);
          }
        }
      }
    };

    // create mutation obsever to handle translateY changes
    const observer = new MutationObserver(onScrollChange);
    observer.observe(infiniteScroll, { attributes: true });
  }

  function handleTouchStart(event) {
    event.preventDefault();
    let touches = event.changedTouches;
    lastTouchPosY = touches[0].pageY;
    cancelAnimationFrame(slowdownAnim);
    cancelAnimationFrame(scrollingAnim);
  }

  function handleTouchMove(event) {
    event.preventDefault();
    endTouchPosY = lastTouchPosY;  // save for touch end
    let touches = event.changedTouches;
    let deltaY = (lastTouchPosY - touches[0].pageY) * -1;
    lastTouchPosY = touches[0].pageY;

    let translateY = getScrollPos() + deltaY;
    setScrollPos(translateY);
    controlFade(deltaY);
  }

  function handleTouchEnd(event) {
    event.preventDefault();
    let touches = event.changedTouches;
    let deltaY = (endTouchPosY - touches[0].pageY) * -1;

    slowdownAnim = window.requestAnimationFrame(slowDownScrollStep);

    // gradually slow down scrolling
    function slowDownScrollStep(timestamp) {
      // make sure infiniteScroll element still exist (page change)
      let infiniteScroll = !!document.querySelector(".infinite-scroll");
      if (infiniteScroll) {

        // clamp delta
        deltaY = Math.min(Math.max(deltaY, -80), 80);

        let translateY = getScrollPos() + deltaY;
        setScrollPos(translateY);
        controlFade(deltaY);

        let stepSize = .25;
        if (deltaY < stepSize) {
          deltaY += stepSize;
          slowdownAnim = window.requestAnimationFrame(slowDownScrollStep);

        } else if (deltaY > stepSize) {
          deltaY -= stepSize
          slowdownAnim = window.requestAnimationFrame(slowDownScrollStep);

        } else {
          deltaY = 0;
          cancelAnimationFrame(slowdownAnim);
        }
      }
    }
  }

  function handleWheel(event) {
    event.preventDefault();
    let deltaY = event.deltaY * -1
    let translateY = getScrollPos() + deltaY;
    setScrollPos(translateY);
    controlFade(deltaY);
    cancelAnimationFrame(slowdownAnim);
    cancelAnimationFrame(scrollingAnim);
  }

  function controlFade(deltaY) {
    let speed = Math.abs(deltaY);
    let max = 80;
    speed = Math.min(Math.max(speed, 0), max);
    let fadeScroll = map(speed, 0, max, 1, .1);
    let fadeStatic = map(speed, 20, max, 0, 1);

    let staticAnim = document.querySelector(".static-anim");
    let infiniteScroll = document.querySelector(".infinite-scroll");
    staticAnim.style.opacity = fadeStatic;
    infiniteScroll.style.opacity = fadeScroll;
  }

  function getScrollPos() {
    let infiniteScroll = document.querySelector(".infinite-scroll");
    let matrix = window.getComputedStyle(infiniteScroll).getPropertyValue('transform');
    let translateY;

    // set to 0 if transform not yet set
    if (matrix === "none") {
      infiniteScroll.style.transform = "translateY(0)";
      translateY = 0;

    } else {  // get value from css
      let matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
      translateY = parseInt(matrixValues[5], 10);
    }

    return translateY;
  }

  function setScrollPos(pos) {
    let infiniteScroll = document.querySelector(".infinite-scroll");
    infiniteScroll.style.transform = "translateY(" + pos + "px)";
  }

  function appendItem() {

    let newId = 0;
    let infinteScroll = document.querySelector(".infinite-scroll");
    let item = document.createElement("div");
    item.classList.add("infinite-scroll__item");
    let animKeys = Object.keys(animation);

    // define new id if children exist
    if (infinteScroll.hasChildNodes()) {
      let prevId = parseInt(infinteScroll.lastChild.getAttribute("data-id"), 10);
      if (prevId === animKeys.length - 1) newId = 0;
      else newId = prevId + 1;
    }

    let fileId = newId + 1;
    let fileName = "Untitled_Artwork-" + fileId.toString();

    item.innerHTML = `<img src="` + animation[fileName]["png"] + `">
    <div>`+ newId + `</div>`;
    item.setAttribute("data-id", newId);
    infinteScroll.appendChild(item);
  }

  function prependItem() {

    let newId = 0;
    let infiniteScroll = document.querySelector(".infinite-scroll");
    let item = document.createElement("div");
    item.classList.add("infinite-scroll__item");
    let animKeys = Object.keys(animation);

    let prevId = parseInt(infiniteScroll.firstChild.getAttribute("data-id"), 10);
    if (prevId === 0) newId = animKeys.length - 1;
    else newId = prevId - 1;

    let fileId = newId + 1;
    let fileName = "Untitled_Artwork-" + fileId.toString();

    item.innerHTML = `<img src="` + animation[fileName]["png"] + `">
  <div>`+ newId + `</div>`;
    item.setAttribute("data-id", newId);
    infiniteScroll.prepend(item);

    // correct scroll position for new item
    infiniteScroll.style.transform = "translateY(" + (-item.offsetHeight) + "px)";
  }
}

function throttledEvent(listener, delay) {
  let timeout;
  return function (event) {
    if (!timeout) {
      // no timer running
      listener(event); // run the function
      timeout = setTimeout(function () {
        timeout = null;
      }, delay); // start a timer that turns itself off when it's done
    }
    // else, do nothing (throttling)
  };
}

function map(num, in_min, in_max, out_min, out_max) {
  // taken from
  // (https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers/23202637)
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = src;
  });
};

initApp();