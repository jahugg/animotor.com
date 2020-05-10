"use strict";

var _markdownIt = _interopRequireDefault(require("markdown-it"));

require("./fonts.less");

require("./styles.less");

var _projects = _interopRequireDefault(require("./projects.json"));

var _ = _interopRequireDefault(require("./media/*.*"));

var _contentInfo = _interopRequireDefault(require("./content-info.md"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var md = new _markdownIt["default"]();
var defaultRoute = "/";
var pages = [{
  "title": "home",
  "route": "/",
  "content": "loadProjects()"
}, {
  "title": "info",
  "route": "/info",
  "content": "content-info.md"
}];

function initApp() {
  var projectData = _projects["default"].projects;
  navigateToCurrentURL();
} // ==============================
// navigate to current url


function navigateToCurrentURL() {
  // read route from url
  var urlPath = window.location.pathname; // get valid routes

  var validRoutes = [];

  for (var _i = 0, _pages = pages; _i < _pages.length; _i++) {
    var page = _pages[_i];
    validRoutes.push(page.route);
  } // check if string matches a valid route


  var pageRoute = defaultRoute;
  if (validRoutes.includes(urlPath)) pageRoute = urlPath; // create state object

  var stateObj = {
    route: pageRoute
  }; // build page

  buildPage(stateObj);
} // ==============================
// build new page


function buildPage(stateObj) {
  // clear page
  var main = document.getElementById("main");
  main.innerHTML = ""; // fetch matching page object

  var currentPage;

  for (var _i2 = 0, _pages2 = pages; _i2 < _pages2.length; _i2++) {
    var page = _pages2[_i2];
    if (page.route == stateObj.route) currentPage = page;
  } // push page browser history


  window.history.pushState(stateObj, '', currentPage.route); // build page contents

  if (currentPage.title === "home") {
    var projects = document.createElement("div");
    projects.classList.add("projects");
    main.appendChild(projects);

    for (var i = 0; i < 10; i++) {
      var project = document.createElement("div");
      project.classList.add("projects__project");
      project.innerHTML = "<img src=\"" + _["default"]["11_Laser"]["jpg"] + "\">";
      projects.appendChild(project);
    }
  } else if (currentPage.title === "info") {
    var link = document.querySelector("#nav a");
    link.href = "/";
    link.innerHTML = "work";
    main.innerHTML = md.render(_contentInfo["default"]);
  }
}

initApp(); // event throttling

function throttledEvent(listener, delay) {
  var timeout;
  return function (event) {
    if (!timeout) {
      // no timer running
      listener(event); // run the function

      timeout = setTimeout(function () {
        timeout = null;
      }, delay); // start a timer that turns itself off when it's done
    } // else, do nothing (throttling)

  };
}

function playAnim(event) {
  var video = document.querySelector(".tiny-anim");
  var increment = 0.05;
  video.currentTime += increment;
  console.log(video.currentTime);
  if (video.currentTime >= video.duration) video.currentTime = 0;else if (video.currentTime <= 0) video.currentTime = video.duration;
}

function controlAnim(event) {
  var delta = event.deltaY * 0.005;
  var video = document.querySelector(".tiny-anim");
  video.currentTime += delta;
  console.log(video.currentTime + "s");
  if (video.currentTime >= video.duration) video.currentTime = 0;else if (video.currentTime <= 0) video.currentTime = video.duration;
}

function handleTiles(event) {
  var container = document.querySelector(".projects");

  if (window.pageYOffset === 0) {
    addTile("top");
  } else if (window.pageYOffset + window.innerHeight === container.offsetHeight) {
    addTile("bottom");
  }
}

function addTile(pos) {
  var projects = _projects["default"].projects;
  var container = document.querySelector(".projects");
  var oldContainerHeight = container.offsetHeight;
  var tile = document.createElement("div");
  tile.classList.add("projects__tile");
  var newId = 0;

  if (pos === "top") {
    // add top
    var prevId = parseInt(container.firstChild.getAttribute("data-id"), 10);
    if (prevId === 0) newId = projects.length - 1;else newId = prevId - 1;
    container.prepend(tile); // correct scroll position for new tile

    var tileHeight = container.offsetHeight - oldContainerHeight;
    window.scrollBy(0, tileHeight); // remove opposite child if not visible

    if (container.offsetHeight - tileHeight >= window.innerHeight * 2) container.lastChild.remove();
  } else if (pos === "bottom") {
    // add bottom
    var _prevId = parseInt(container.lastChild.getAttribute("data-id"), 10);

    if (_prevId === projects.length - 1) newId = 0;else newId = _prevId + 1;
    container.appendChild(tile); // remove opposite child if not visible

    var _tileHeight = container.offsetHeight - oldContainerHeight;

    if (container.offsetHeight - _tileHeight >= window.innerHeight * 2) container.firstChild.remove();
  } // customise tile


  tile.innerHTML = projects[newId].title;
  tile.setAttribute("data-id", newId);
}