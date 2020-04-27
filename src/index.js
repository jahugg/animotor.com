import "./styles.less";
import data from "./projects.json";

function initApp() {
  let app = document.getElementById("app");
  let projects = data.projects;

  let container = document.createElement("div");
  container.classList.add("projects");
  app.appendChild(container);

  // add all projects to container
  for (let item of projects) {
    let elem = document.createElement("div");
    elem.classList.add("projects__item");
    elem.innerHTML = item.title;
    container.appendChild(elem);
  }

  let index = 0;
  // add projects after
  while (container.offsetHeight < window.innerHeight * 2) {
    let elem = document.createElement("div");
    elem.classList.add("projects__item");
    elem.innerHTML = projects[index].title;
    container.appendChild(elem);

    // cycle through projects
    if (index === projects.length - 1) index = 0;
    else index++;
  }

  index = projects.length - 1;
  let scrollY = 0;
  // add projects before
  while (container.offsetHeight < window.innerHeight * 3) {
    let elem = document.createElement("div");
    elem.classList.add("projects__item");
    elem.innerHTML = projects[index].title;

    let oldHeight = container.offsetHeight;
    container.prepend(elem);
    scrollY += container.offsetHeight - oldHeight;

    // cycle through projects
    if (index === 0) index = projects.length - 1;
    else index--;
  }
  // correct scrolling position
  window.scrollBy(0, scrollY);
  window.addEventListener("scroll", throttledEvent(handleTiles, 10000));
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

function handleTiles() {
  console.log("handling");
}
