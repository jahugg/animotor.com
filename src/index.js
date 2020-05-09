import "./fonts.less";
import "./styles.less";
import data from "./projects.json";
import mediaFiles from './media/*.*';

let lastScrollPos = 0;

function initApp() {
  let projectData = data.projects;
  let app = document.getElementById("app");
  let main = document.getElementById("main");
  let nav = document.getElementById("nav");

  let projects = document.createElement("div");
  projects.classList.add("projects");
  main.appendChild(projects);

  for (let i = 0; i < 10; i++) {
    let project = document.createElement("div");
    project.classList.add("projects__project");
    project.innerHTML=`<img src="`+mediaFiles["11_Laser"]["jpg"]+`">`;
    projects.appendChild(project);
  }

  let animation = document.createElement("img");
  animation.classList.add("tiny-anim");
  animation.src = mediaFiles["1_huhn_00050"]["png"];
  document.querySelector(".nav__home").appendChild(animation);

  
  


// add animation to navigation
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

function playAnim(event){
  let video = document.querySelector(".tiny-anim");
  let increment = 0.05;
  video.currentTime += increment;
  console.log(video.currentTime);

  if (video.currentTime >= video.duration)
    video.currentTime = 0;
  else if (video.currentTime <= 0)
    video.currentTime = video.duration;
  
}

function controlAnim(event) {
  let delta = event.deltaY * 0.005;

  let video = document.querySelector(".tiny-anim");
  video.currentTime += delta;

console.log(video.currentTime+"s");

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
