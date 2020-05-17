import "./fonts.less";
import "./styles.less";
import data from "./projects.json";
import mediaFiles from "./media/*.*";
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

  // create state object
  let stateObj = { route: target.getAttribute("href") };

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
    loadProjects();

  } else if (currentPage.title === "about") {
    let link = document.querySelector("#nav a");
    link.href = "/";
    link.innerHTML = "work";
    main.innerHTML = `<article class="about">` + contentInfo + `</article>`;
  }
}

function loadProjects() {

  let link = document.querySelector("#nav a");
  link.href = "/about";
  link.innerHTML = "about";

  let container = document.createElement("div");
  container.classList.add("projects-container");
  main.appendChild(container);

  let projects = document.createElement("div");
  projects.classList.add("projects");
  container.appendChild(projects);

  // fill screen with tiles
  while (projects.scrollHeight <= window.innerHeight)
    appendProject();

  // register event listeners
  container.addEventListener("wheel", throttledEvent(handleWheel, 5));
  container.addEventListener("touchstart", handleTouchStart, false);
  container.addEventListener("touchmove", throttledEvent(handleTouchMove, 5), false);
  container.addEventListener("touchend", handleTouchEnd, false);
  container.addEventListener("touchcancel", handleTouchEnd, false);

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
    customScroll(deltaY);
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

      customScroll(deltaY);

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
    customScroll(deltaY);
  }

  // trigger custom scrolling of filmstrip
  function customScroll(deltaY) {

    console.log(deltaY);

    let projects = document.querySelector(".projects");
    let matrix = window.getComputedStyle(projects).getPropertyValue('transform');
    let translateY;

    // set to 0 if transform not set
    if (matrix === "none") {
      projects.style.transform = "translateY(0)";
      translateY = 0;

    } else {  // get value from css
      let matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
      translateY = parseInt(matrixValues[5], 10);
    }

    //---------
    // apply scroll distance
    translateY += deltaY;
    projects.style.transform = "translateY(" + translateY + "px)";

    //---------
    // check for projects out of screen
    let top = projects.firstChild;
    let bottom = projects.lastChild;

    // remove first child if out of screen
    if (Math.abs(translateY) > top.offsetHeight) {
      top.remove();
      projects.style.transform = "translateY(0)";
    }
    // remove last child if out of screen
    else if (projects.offsetHeight - bottom.offsetHeight - Math.abs(translateY)
      > window.innerHeight)
      bottom.remove();

    //---------
    // prepend new child if top reached
    if (translateY >= 0)
      prependProject();

    // append new child if bottom reached
    else if (window.innerHeight + Math.abs(translateY) > projects.offsetHeight)
      appendProject();
  }

  function appendProject() {

    let newId = 0;
    let projects = document.querySelector(".projects");
    let project = document.createElement("div");
    project.classList.add("projects__project");

    // define new id if children exist
    if (projects.hasChildNodes()) {
      let prevId = parseInt(projects.lastChild.getAttribute("data-id"), 10);
      if (prevId === data.projects.length - 1) newId = 0;
      else newId = prevId + 1;
    }

    project.innerHTML = `<img src="` + mediaFiles["11_Laser"]["jpg"] + `">
    <div>`+ data.projects[newId].title + `</div>`;
    project.setAttribute("data-id", newId);
    projects.appendChild(project);
  }

  function prependProject() {

    let newId = 0;
    let projects = document.querySelector(".projects");
    let project = document.createElement("div");
    project.classList.add("projects__project");

    let prevId = parseInt(projects.firstChild.getAttribute("data-id"), 10);
    if (prevId === 0) newId = data.projects.length - 1;
    else newId = prevId - 1;

    project.innerHTML = `<img src="` + mediaFiles["11_Laser"]["jpg"] + `">
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

function playAnim(event) {
  let video = document.querySelector(".tiny-anim");
  let increment = 0.05;
  video.currentTime += increment;
  console.log(video.currentTime);

  if (video.currentTime >= video.duration)
    video.currentTime = 0;
  else if (video.currentTime <= 0)
    video.currentTime = video.duration;

}

function controlAnim(event) {
  let delta = event.deltaY * 0.005;

  let video = document.querySelector(".tiny-anim");
  video.currentTime += delta;

  console.log(video.currentTime + "s");

  if (video.currentTime >= video.duration)
    video.currentTime = 0;
  else if (video.currentTime <= 0)
    video.currentTime = video.duration;
}

function map(num, in_min, in_max, out_min, out_max) {
  // taken from
  // (https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers/23202637)
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

initApp();
