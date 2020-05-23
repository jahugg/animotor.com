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
  "content": "loadProjects()"
}, {
  "title": "about",
  "route": "/about",
  "content": "content-info.md"
}];

function initApp() {
  navigateToCurrentURL();

  // add custom link functionality
  let links = document.querySelectorAll('a[data-link="page"]');
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

  // build page contents
  if (currentPage.title === "home") {
    loadHome();

  } else if (currentPage.title === "about") {
    let link = document.querySelector("#nav a");
    link.href = "/";
    link.innerHTML = "work";
    main.innerHTML = `<article class="about">` + contentInfo + `</article>`;
  }
}

function loadHome() {

  let link = document.querySelector("#nav a");
  link.href = "/about";
  link.innerHTML = "about";

  let container = document.createElement("div");
  container.classList.add("infinite-scroll-container");
  main.appendChild(container);

  let projects = document.createElement("div");
  projects.classList.add("infinite-scroll");
  container.appendChild(projects);

  // fill screen with tiles
  while (projects.scrollHeight <= window.innerHeight)
    appendItem();

  // register event listeners
  container.addEventListener("wheel", throttledEvent(handleWheel, 0));
  container.addEventListener("touchstart", handleTouchStart, false);
  container.addEventListener("touchmove", throttledEvent(handleTouchMove, 0), false);
  container.addEventListener("touchend", handleTouchEnd, false);
  container.addEventListener("touchcancel", handleTouchEnd, false);

  // Select the node that will be observed for mutations
  const targetNode = projects;
  const config = { attributes: true };

  // Callback function to execute when mutations are observed
  const handleInfiniteScroll = function (mutationsList, observer) {
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
      }
    }
  };

  // create mutation obsever to handle translateY changes
  const observer = new MutationObserver(handleInfiniteScroll);
  observer.observe(targetNode, config);

  // handle touch events
  let lastTouchPosY;
  let endTouchPosY;
  let reqAnimFrame;

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

      if (deltaY > 0 || deltaY < 0) {
        reqAnimFrame = window.requestAnimationFrame(slowDownScrollStep);

        if (deltaY > 0) deltaY--;
        else if (deltaY < 0) deltaY++;
      }
    }
  }

  // handle wheel event
  function handleWheel(event) {
    event.preventDefault();
    let deltaY = event.deltaY * -1
    let translateY = getScrollPos() + deltaY;
    setScrollPos(translateY);
  }

  function getScrollPos() {
    let infiniteScroll = document.querySelector(".infinite-scroll");
    let matrix = window.getComputedStyle(infiniteScroll).getPropertyValue('transform');
    let translateY;

    // set to 0 if transform not set
    if (matrix === "none") {
      projects.style.transform = "translateY(0)";
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
    let projects = document.querySelector(".infinite-scroll");
    let project = document.createElement("div");
    project.classList.add("infinite-scroll__item");

    // define new id if children exist
    if (projects.hasChildNodes()) {
      let prevId = parseInt(projects.lastChild.getAttribute("data-id"), 10);
      if (prevId === data.projects.length - 1) newId = 0;
      else newId = prevId + 1;
    }

    let animFrame = newId.toString().padStart(5, "0");

    project.innerHTML = `<img src="` + animation["1_huhn_" + animFrame]["png"] + `">
    <div>`+ data.projects[newId].title + `</div>`;
    project.setAttribute("data-id", newId);
    projects.appendChild(project);
  }

  function prependItem() {

    let newId = 0;
    let projects = document.querySelector(".infinite-scroll");
    let project = document.createElement("div");
    project.classList.add("infinite-scroll__item");

    let prevId = parseInt(projects.firstChild.getAttribute("data-id"), 10);
    if (prevId === 0) newId = data.projects.length - 1;
    else newId = prevId - 1;

    let animFrame = newId.toString().padStart(5, "0");

    project.innerHTML = `<img src="` + animation["1_huhn_" + animFrame]["png"] + `">
  <div>`+ data.projects[newId].title + `</div>`;
    project.setAttribute("data-id", newId);
    projects.prepend(project);

    // correct scroll position for new project
    projects.style.transform = "translateY(" + (-project.offsetHeight) + "px)";
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