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
  "title": "info",
  "route": "/info",
  "content": "content-info.md"
}];
let pointStart = false;
let pointDrag = false;

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

  } else if (currentPage.title === "info") {
    let link = document.querySelector("#nav a");
    link.href = "/";
    link.innerHTML = "work";
    main.innerHTML = `<article class="about">` + contentInfo + `</article>`;
  }
}

function loadProjects() {

  let link = document.querySelector("#nav a");
  link.href = "/info";
  link.innerHTML = "about";

  let projects = document.createElement("div");
  projects.classList.add("projects");
  main.appendChild(projects);


  while (projects.scrollHeight <= window.innerHeight)
    appendProject();

  if (projects.scrollTop === 0)
    prependProject();

  projects.addEventListener("wheel", customScroll);

  let scale = 1;
  function customScroll(event) {
    event.preventDefault;

    scale += event.deltaY * -0.01;
    scale = Math.min(Math.max(.125, scale), 4);
  }

  function appendProject() {

    let newId = 0;
    let projects = document.querySelector(".projects");
    let project = document.createElement("div");
    project.classList.add("projects__project");

    // has children
    if (projects.hasChildNodes()) {
      let prevId = parseInt(projects.lastChild.getAttribute("data-id"), 10);
      if (prevId === data.projects.length - 1) newId = 0;
      else newId = prevId + 1;

      // remove opposite child if not visible
      // let tileHeight = container.offsetHeight - oldContainerHeight;
      // if (container.offsetHeight - tileHeight >= window.innerHeight * 2)
      //   container.firstChild.remove();
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

    // correct scroll position for new tile
    // let tileHeight = container.offsetHeight - oldContainerHeight;
    // window.scrollBy(0, tileHeight);

    // // remove opposite child if not visible
    // if (container.offsetHeight - tileHeight >= window.innerHeight * 2)
    //   container.lastChild.remove();
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

initApp();
