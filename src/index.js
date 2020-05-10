import MarkdownIt from "markdown-it";
import "./fonts.less";
import "./styles.less";
import data from "./projects.json";
import mediaFiles from "./media/*.*";
import contentInfo from "./content-info.md";

let md = new MarkdownIt();
let defaultRoute = "/";
let pages =
  [{
    "title": "home",
    "route": "/",
    "content": "loadProjects()"
  }, {
    "title": "info",
    "route": "/info",
    "content": "content-info.md"
  }];

function initApp() {
  let projectData = data.projects;

  navigateToCurrentURL();
}

// ==============================
// navigate to current url
function navigateToCurrentURL() {

  // read route from url
  var urlPath = window.location.pathname;

  // get valid routes
  let validRoutes = [];
  for (let page of pages) {
    validRoutes.push(page.route);
  }

  // check if string matches a valid route
  let pageRoute = defaultRoute;
  if (validRoutes.includes(urlPath))
    pageRoute = urlPath;

  // create state object
  let stateObj = { route: pageRoute };

  // build page
  buildPage(stateObj);
}

// ==============================
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
    let projects = document.createElement("div");
    projects.classList.add("projects");
    main.appendChild(projects);

    for (let i = 0; i < 10; i++) {
      let project = document.createElement("div");
      project.classList.add("projects__project");
      project.innerHTML = `<img src="` + mediaFiles["11_Laser"]["jpg"] + `">`;
      projects.appendChild(project);
    }

  } else if (currentPage.title === "info") {
    let link = document.querySelector("#nav a");
    link.href = "/";
    link.innerHTML = "work";
    main.innerHTML = md.render(contentInfo);
  }
}

initApp();

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

function handleTiles(event) {
  let container = document.querySelector(".projects");

  if (window.pageYOffset === 0) {
    addTile("top");
  } else if (
    window.pageYOffset + window.innerHeight ===
    container.offsetHeight
  ) {
    addTile("bottom");
  }
}

function addTile(pos) {
  let projects = data.projects;
  let container = document.querySelector(".projects");
  let oldContainerHeight = container.offsetHeight;
  let tile = document.createElement("div");
  tile.classList.add("projects__tile");
  let newId = 0;

  if (pos === "top") {
    // add top
    let prevId = parseInt(container.firstChild.getAttribute("data-id"), 10);
    if (prevId === 0) newId = projects.length - 1;
    else newId = prevId - 1;
    container.prepend(tile);
    // correct scroll position for new tile
    let tileHeight = container.offsetHeight - oldContainerHeight;
    window.scrollBy(0, tileHeight);

    // remove opposite child if not visible
    if (container.offsetHeight - tileHeight >= window.innerHeight * 2)
      container.lastChild.remove();
  } else if (pos === "bottom") {
    // add bottom
    let prevId = parseInt(container.lastChild.getAttribute("data-id"), 10);
    if (prevId === projects.length - 1) newId = 0;
    else newId = prevId + 1;
    container.appendChild(tile);

    // remove opposite child if not visible
    let tileHeight = container.offsetHeight - oldContainerHeight;
    if (container.offsetHeight - tileHeight >= window.innerHeight * 2)
      container.firstChild.remove();
  }

  // customise tile
  tile.innerHTML = projects[newId].title;
  tile.setAttribute("data-id", newId);
}
