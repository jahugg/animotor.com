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
  "title": "about",
  "route": "/about",
  "content": "content-info.md"
}];
var pointStart = false;
var pointDrag = false;

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
} // navigate to current url


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
} // build new page


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
    loadProjects();
  } else if (currentPage.title === "about") {
    var link = document.querySelector("#nav a");
    link.href = "/";
    link.innerHTML = "work";
    main.innerHTML = "<article class=\"about\">" + _contentInfo["default"] + "</article>";
  }
}

function loadProjects() {
  var link = document.querySelector("#nav a");
  link.href = "/about";
  link.innerHTML = "about";
  var container = document.createElement("div");
  container.classList.add("projects-container");
  main.appendChild(container);
  var projects = document.createElement("div");
  projects.classList.add("projects");
  container.appendChild(projects);

  while (projects.scrollHeight <= window.innerHeight) {
    appendProject();
  }

  if (projects.scrollTop === 0) prependProject();
  container.addEventListener("wheel", customScroll);
  var scale = 1;

  function customScroll(event) {
    event.preventDefault;
    var container = document.querySelector(".projects-container");
    var projects = document.querySelector(".projects");
    var projectRef = document.querySelector(".projects__project");
    var transformY = projects.style.transform.replace(/[^\d.]/g, '');
    console.log(transformY);
    if (scrollY < 10) console.log("prepend");else if (scrollY > 1000) console.log("append");
    scale += event.deltaY * -0.01;
    scale = Math.min(Math.max(.125, scale), 4);
    console.log(scale);
  }

  function appendProject() {
    var newId = 0;
    var projects = document.querySelector(".projects");
    var project = document.createElement("div");
    project.classList.add("projects__project"); // has children

    if (projects.hasChildNodes()) {
      var prevId = parseInt(projects.lastChild.getAttribute("data-id"), 10);
      if (prevId === _projects["default"].projects.length - 1) newId = 0;else newId = prevId + 1; // remove opposite child if not visible
      // let tileHeight = container.offsetHeight - oldContainerHeight;
      // if (container.offsetHeight - tileHeight >= window.innerHeight * 2)
      //   container.firstChild.remove();
    }

    project.innerHTML = "<img src=\"" + _["default"]["11_Laser"]["jpg"] + "\">\n    <div>" + _projects["default"].projects[newId].title + "</div>";
    project.setAttribute("data-id", newId);
    projects.appendChild(project);
  }

  function prependProject() {
    var newId = 0;
    var container = document.querySelector(".projects-container");
    var projects = document.querySelector(".projects");
    var oldProjectsHeight = projects.offsetHeight;
    var project = document.createElement("div");
    project.classList.add("projects__project");
    var prevId = parseInt(projects.firstChild.getAttribute("data-id"), 10);
    if (prevId === 0) newId = _projects["default"].projects.length - 1;else newId = prevId - 1;
    project.innerHTML = "<img src=\"" + _["default"]["11_Laser"]["jpg"] + "\">\n  <div>" + _projects["default"].projects[newId].title + "</div>";
    project.setAttribute("data-id", newId);
    projects.prepend(project); // correct scroll position for new tile

    var itemHeight = projects.offsetHeight - oldProjectsHeight;
    projects.style.transform = "translateY(" + -itemHeight + "px)"; // remove opposite child if not visible

    if (projects.offsetHeight - project.offsetHeight * 2 >= window.innerHeight) projects.lastChild.remove();
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

initApp();