"use strict";

require("./fonts.less");

require("./styles.less");

var _projects = _interopRequireDefault(require("./projects.json"));

var _ = _interopRequireDefault(require("./media/*.*"));

var _2 = _interopRequireDefault(require("./animation/*.*"));

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
  container.appendChild(projects); // fill screen with tiles

  while (projects.scrollHeight <= window.innerHeight) {
    appendProject();
  } // register event listeners


  container.addEventListener("wheel", throttledEvent(handleWheel, 0));
  container.addEventListener("touchstart", handleTouchStart, false);
  container.addEventListener("touchmove", throttledEvent(handleTouchMove, 0), false);
  container.addEventListener("touchend", handleTouchEnd, false);
  container.addEventListener("touchcancel", handleTouchEnd, false); // handle touch events

  var lastTouchPosY;
  var endTouchPosY;
  var reqAnimFrame;

  function handleTouchStart(event) {
    event.preventDefault();
    var touches = event.changedTouches;
    lastTouchPosY = touches[0].pageY;
    cancelAnimationFrame(reqAnimFrame);
  }

  function handleTouchMove(event) {
    event.preventDefault();
    endTouchPosY = lastTouchPosY; // save for touch end

    var touches = event.changedTouches;
    var deltaY = (lastTouchPosY - touches[0].pageY) * -1;
    lastTouchPosY = touches[0].pageY;
    customScroll(deltaY);
  }

  function handleTouchEnd(event) {
    event.preventDefault();
    var touches = event.changedTouches;
    var deltaY = (endTouchPosY - touches[0].pageY) * -1;
    reqAnimFrame = requestAnimationFrame(slowDownScrollStep); // gradually slow down scrolling

    function slowDownScrollStep(timestamp) {
      // clamp delta
      deltaY = Math.min(Math.max(deltaY, -80), 80);
      customScroll(deltaY);

      if (deltaY > 0 || deltaY < 0) {
        reqAnimFrame = window.requestAnimationFrame(slowDownScrollStep);
        if (deltaY > 0) deltaY--;else if (deltaY < 0) deltaY++;
      }
    }
  } // handle wheel event


  function handleWheel(event) {
    event.preventDefault();
    var deltaY = event.deltaY * -1;
    customScroll(deltaY);
  } // trigger custom scrolling of filmstrip


  function customScroll(deltaY) {
    // consider using a mutation observer to observe
    // transform changes.
    var projects = document.querySelector(".projects");
    var matrix = window.getComputedStyle(projects).getPropertyValue('transform');
    var translateY; // set to 0 if transform not set

    if (matrix === "none") {
      projects.style.transform = "translateY(0)";
      translateY = 0;
    } else {
      // get value from css
      var matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
      translateY = parseInt(matrixValues[5], 10);
    } //---------
    // apply scroll distance


    translateY += deltaY;
    projects.style.transform = "translateY(" + translateY + "px)"; //---------
    // check for projects out of screen

    var top = projects.firstChild;
    var bottom = projects.lastChild; // remove first child if out of screen

    if (Math.abs(translateY) > top.offsetHeight) {
      top.remove();
      projects.style.transform = "translateY(0)";
    } // remove last child if out of screen
    else if (projects.offsetHeight - bottom.offsetHeight - Math.abs(translateY) > window.innerHeight) bottom.remove(); //---------
    // prepend new child if top reached


    if (translateY >= 0) prependProject(); // append new child if bottom reached
    else if (window.innerHeight + Math.abs(translateY) > projects.offsetHeight) appendProject();
  }

  function appendProject() {
    var newId = 0;
    var projects = document.querySelector(".projects");
    var project = document.createElement("div");
    project.classList.add("projects__project"); // define new id if children exist

    if (projects.hasChildNodes()) {
      var prevId = parseInt(projects.lastChild.getAttribute("data-id"), 10);
      if (prevId === _projects["default"].projects.length - 1) newId = 0;else newId = prevId + 1;
    }

    var animFrame = newId.toString().padStart(5, "0");
    project.innerHTML = "<img src=\"" + _2["default"]["1_huhn_" + animFrame]["png"] + "\">\n    <div>" + _projects["default"].projects[newId].title + "</div>";
    project.setAttribute("data-id", newId);
    projects.appendChild(project);
  }

  function prependProject() {
    var newId = 0;
    var projects = document.querySelector(".projects");
    var project = document.createElement("div");
    project.classList.add("projects__project");
    var prevId = parseInt(projects.firstChild.getAttribute("data-id"), 10);
    if (prevId === 0) newId = _projects["default"].projects.length - 1;else newId = prevId - 1;
    var animFrame = newId.toString().padStart(5, "0");
    project.innerHTML = "<img src=\"" + _2["default"]["1_huhn_" + animFrame]["png"] + "\">\n  <div>" + _projects["default"].projects[newId].title + "</div>";
    project.setAttribute("data-id", newId);
    projects.prepend(project); // correct scroll position for new project

    projects.style.transform = "translateY(" + -project.offsetHeight + "px)";
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

function map(num, in_min, in_max, out_min, out_max) {
  // taken from
  // (https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers/23202637)
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

initApp();