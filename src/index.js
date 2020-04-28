import "./styles.less";
import data from "./projects.json";

function initApp() {
  let projects = data.projects;
  let app = document.getElementById("app");
  let container = document.createElement("div");
  container.classList.add("projects");
  app.appendChild(container);

  // add first tile
  let tile = document.createElement("div");
  tile.classList.add("projects__item");
  tile.innerHTML = projects[0].title;
  tile.setAttribute("data-id", 0);
  container.appendChild(tile);

  // fill screen with tiles
  while (container.offsetHeight < window.innerHeight) {
    addTile("bottom");
  }

  // add event listeners
  window.addEventListener("scroll", throttledEvent(handleTiles, 5));
}

initApp();

// event throttling
function throttledEvent(listener, delay) {
  let timeout;
  return function(event) {
    if (!timeout) {
      // no timer running
      listener(event); // run the function
      timeout = setTimeout(function() {
        timeout = null;
      }, delay); // start a timer that turns itself off when it's done
    }
    // else, do nothing (throttling)
  };
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
  tile.classList.add("projects__item");
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
