import "./fonts.less";
import "./styles.less";
import data from "./projects.json";
import mediaFiles from "./media/*.*";
import animation from "./animation/*.*";
import contentInfo from "./content-info.md";

let defaultRoute = "/";
let pages = [{
  "title": "home",
  "route": "/",
  "content": "loadHome()"
}, {
  "title": "work",
  "route": "/work",
  "content": "loadWork()"
}, {
  "title": "info",
  "route": "/info",
  "content": "content-info.md"
}];

function initApp() {
  navigateToCurrentURL();

  // add custom link functionality
  let links = document.querySelectorAll('a[data-link]');
  for (let link of links)
    link.addEventListener("click", handlePageLink);
}

function handlePageLink(event) {
  event.preventDefault();
  let target = event.target;
  let stateObj = { route: target.getAttribute("href") }; // create state object
  buildPage(stateObj);
}

// navigate to current url
function navigateToCurrentURL() {

  // read route from url
  var urlPath = window.location.pathname;

  // get valid routes
  let validRoutes = [];
  for (let page of pages)
    validRoutes.push(page.route);

  // check if string matches a valid route
  let pageRoute = defaultRoute;
  if (validRoutes.includes(urlPath))
    pageRoute = urlPath;

  // create state object
  let stateObj = { route: pageRoute };

  // build page
  buildPage(stateObj);
}

// build new page
function buildPage(stateObj) {

  // clear page
  let main = document.getElementById("main");
  main.innerHTML = "";

  // fetch matching page object
  let currentPage;
  for (let page of pages)
    if (page.route == stateObj.route)
      currentPage = page;

  // push page browser history
  window.history.pushState(stateObj, '', currentPage.route);

  // handle navigation items
  let links = document.querySelectorAll('a[data-link]');
  for (let link of links)
    link.removeAttribute("data-active");

  // set link for current page as active
  document.querySelector('a[href="' + currentPage.route + '"]').setAttribute("data-active", "");

  // build page contents
  if (currentPage.title === "home") {
    loadHome();

  } else if (currentPage.title === "info") {
    main.innerHTML = `<article class="info">` + contentInfo + `</article>`;
  }
}

function loadHome() {

  // container
  let container = document.createElement("div");
  container.classList.add("infinite-scroll-container");
  main.appendChild(container);

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

  // handle touch events
  let lastTouchPosY;
  let endTouchPosY;
  let reqAnimFrame;

  let moveTracker = 0;

  function handleTouchStart(event) {
    event.preventDefault();
    let touches = event.changedTouches;
    lastTouchPosY = touches[0].pageY;
    cancelAnimationFrame(reqAnimFrame);
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

    reqAnimFrame = requestAnimationFrame(slowDownScrollStep);

    // gradually slow down scrolling
    function slowDownScrollStep(timestamp) {
      // clamp delta
      deltaY = Math.min(Math.max(deltaY, -80), 80);

      let translateY = getScrollPos() + deltaY;
      setScrollPos(translateY);
      controlFade(deltaY);

      if (deltaY > 0 || deltaY < 0) {
        reqAnimFrame = window.requestAnimationFrame(slowDownScrollStep);
        let stepSize = .5;

        if (deltaY > 0) deltaY -= stepSize;
        else if (deltaY < 0) deltaY += stepSize;
      }
    }
  }

  // handle wheel event
  function handleWheel(event) {
    event.preventDefault();
    let deltaY = event.deltaY * -1
    let translateY = getScrollPos() + deltaY;
    setScrollPos(translateY);
    controlFade(deltaY);
  }

  function controlFade(deltaY) {
    let speed = Math.abs(deltaY);
    let max = 50;
    speed = Math.min(Math.max(speed, 0), max);
    let fadeScroll = map(speed, 0, max, 1, .2);
    let fadeStatic = map(speed, 10, max, 0, 1);

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

    item.innerHTML = `<img src="` + animation[animKeys[newId]]["png"] + `">
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

    item.innerHTML = `<img src="` + animation[animKeys[newId]]["png"] + `">
  <div>`+ newId + `</div>`;
    item.setAttribute("data-id", newId);
    infiniteScroll.prepend(item);

    // correct scroll position for new item
    infiniteScroll.style.transform = "translateY(" + (-item.offsetHeight) + "px)";
  }
}

// event throttling
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

initApp();