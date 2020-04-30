"use strict";

require("./styles.less");

var _projects = _interopRequireDefault(require("./projects.json"));

var _ = _interopRequireDefault(require("./media/*.*"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function initApp() {
  var projects = _projects["default"].projects;
  var app = document.getElementById("app");
  var container = document.createElement("div");
  container.classList.add("projects");
  app.appendChild(container); // add first tile

  var tile = document.createElement("div");
  tile.classList.add("projects__item");
  tile.innerHTML = projects[0].title;
  tile.setAttribute("data-id", 0);
  container.appendChild(tile); // fill screen with tiles

  while (container.offsetHeight < window.innerHeight) {
    addTile("bottom");
  }

  addTile("top");
  var videoContainer = document.createElement("div");
  videoContainer.classList.add("animation");
  videoContainer.innerHTML = "<video>\n    <source src=\"" + _["default"]["huhn"]["mp4"] + "\" type=\"video/mp4\">\n  </video";
  app.appendChild(videoContainer); // add event listener

  window.addEventListener("scroll", throttledEvent(handleTiles, 5));
  window.addEventListener("scroll", throttledEvent(controlVideo, 5));
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

function controlVideo(event) {
  var video = document.querySelector(".animation video");
  video.currentTime += .01;
  if (video.currentTime >= video.duration) video.currentTime = 0;
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
  tile.classList.add("projects__item");
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