"use strict";

require("./fonts.less");

require("./styles.less");

var _projects = _interopRequireDefault(require("./projects.json"));

var _ = _interopRequireDefault(require("./media/*.*"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var lastScrollPos = 0;

function initApp() {
  var projectData = _projects["default"].projects;
  var app = document.getElementById("app");
  var main = document.getElementById("main");
  var nav = document.getElementById("nav");
  var projects = document.createElement("div");
  projects.classList.add("projects");
  main.appendChild(projects);

  for (var i = 0; i < 10; i++) {
    var project = document.createElement("div");
    project.classList.add("projects__project");
    project.innerHTML = "<img src=\"" + _["default"]["11_Laser"]["jpg"] + "\">";
    projects.appendChild(project);
  }

  var animation = document.createElement("img");
  animation.classList.add("tiny-anim");
  animation.src = _["default"]["1_huhn_00050"]["png"];
  document.querySelector(".nav__home").appendChild(animation); // add animation to navigation
  // let anim = document.createElement("video");
  // anim.classList.add("tiny-anim");
  // anim.setAttribute("loop", true);
  // anim.setAttribute("preload", "auto");
  // anim.innerHTML = `<source src="`+mediaFiles["huhn"]["mp4"]+`" type="video/mp4">`;
  // document.querySelector(".nav__home").appendChild(anim);
  // app.addEventListener("wheel", controlAnim);
  // window.requestAnimationFrame(animate);
  // function animate(){
  //   playAnim();
  //   window.requestAnimationFrame(animate);
  // }
  // let container = document.createElement("div");
  // container.classList.add("projects");
  // app.appendChild(container);
  // add first tile
  // let tile = document.createElement("div");
  // tile.classList.add("projects__tile");
  // tile.innerHTML = projects[0].title;
  // tile.setAttribute("data-id", 0);
  // container.appendChild(tile);
  // // fill screen with tiles
  // while (container.offsetHeight < window.innerHeight) {
  //   addTile("bottom");
  // }
  // addTile("top");
  // // add event listener
  // window.addEventListener("scroll", throttledEvent(handleTiles, 5));
  // window.addEventListener("scroll", throttledEvent(controlAnim, 0));
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