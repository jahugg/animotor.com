"use strict";

require("./fonts.less");

require("./styles.less");

var _projects = _interopRequireDefault(require("./projects.json"));

var _ = _interopRequireDefault(require("./media/*.*"));

var _contentInfo = _interopRequireDefault(require("./content-info.md"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
  navigateToCurrentURL(); // add custom link functionality

  var links = document.querySelectorAll('a[data-link="page"]');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = links[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var link = _step.value;
      link.addEventListener("click", handlePageLink);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function handlePageLink(event) {
  event.preventDefault();
  var target = event.target; // create state object

  var stateObj = {
    route: target.getAttribute("href")
  };
  buildPage(stateObj);
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
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = pages[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var page = _step2.value;
      if (page.route == stateObj.route) currentPage = page;
    } // push page browser history

  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  window.history.pushState(stateObj, '', currentPage.route); // build page contents

  if (currentPage.title === "home") {
    var link = document.querySelector("#nav a");
    link.href = "/info";
    link.innerHTML = "about";
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
    var _link = document.querySelector("#nav a");

    _link.href = "/";
    _link.innerHTML = "work";
    main.innerHTML = "<article class=\"about\">" + _contentInfo["default"] + "</article>";
  }
} // event throttling


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

initApp();