import animation from "./../media/home/animation/*.*";
import * as helpers from "./helpers.js";

export function render() {

  let lastTouchPosY;
  let endTouchPosY;
  let slowdownAnim;
  let customSlowDownFlag = false;
  let lastWheelDeltaY = 0;
  let wheelRetriggerred = false;

  // container
  let container = document.createElement("div");
  container.classList.add("infinite-scroll-container");
  container.innerHTML = '<div class="infinite-scroll-loader"><div>';
  main.appendChild(container);

  // preload all images
  let promises = [];
  for (let image in animation)
    for (let type in animation[image])
      promises.push(helpers.loadImage(animation[image][type]));

  // add animation scroller after images have been loaded
  Promise.all(promises)
    .then(initAnimationScroller)
    .catch(err => console.error(err));

  function initAnimationScroller(images) {

    // remove loading message
    container.innerHTML = "";

    // static animation frame
    let animKeys = Object.keys(animation);
    let staticAnim = document.createElement("div");
    staticAnim.classList.add("static-anim");
    container.appendChild(staticAnim);
    let frame = document.createElement("img");
    frame.src = animation[animKeys[0]]["png"];
    frame.setAttribute("data-id", 0);
    staticAnim.appendChild(frame);

    // infinite scroll
    let infiniteScroll = document.createElement("div");
    infiniteScroll.classList.add("infinite-scroll");
    container.appendChild(infiniteScroll);

    // fill screen with tiles
    let containerRect = container.getBoundingClientRect();
    while (infiniteScroll.scrollHeight <= containerRect.height)
      appendItem();

    // register event listeners
    container.addEventListener("wheel", helpers.throttledEvent(handleWheel, 5));
    container.addEventListener("touchstart", handleTouchStart, false);
    container.addEventListener("touchmove", helpers.throttledEvent(handleTouchMove, 5), false);
    container.addEventListener("touchend", handleTouchEnd, false);
    container.addEventListener("touchcancel", handleTouchEnd, false);

    // callback function to execute when mutations are observed
    const onScrollChange = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' &&
          mutation.attributeName === 'style') {

          let infiniteScroll = document.querySelector(".infinite-scroll");
          let translateY = getScrollPos();
          let firstChild = infiniteScroll.firstChild;
          let lastChild = infiniteScroll.lastChild;

          // remove first child if out of bounds
          if (Math.abs(translateY) > firstChild.offsetHeight) {
            firstChild.remove();
            infiniteScroll.style.transform = "translateY(0)";
          }
          // remove last child out of bounds
          else if (infiniteScroll.offsetHeight - lastChild.offsetHeight - Math.abs(translateY)
            > containerRect.height)
            lastChild.remove();

          // prepend new child if top reached
          if (translateY > 0)
            prependItem();

          // append new child if bottom reached
          else if (containerRect.height + Math.abs(translateY) > infiniteScroll.offsetHeight)
            appendItem();

          // ----------
          // handle static animation frame
          let items = document.getElementsByClassName("infinite-scroll__item");
          let staticContainer = document.querySelector(".static-anim");
          let staticRect = staticContainer.getBoundingClientRect();
          let closestItem;
          let lastDist = 9999;

          // find closest item
          for (let item of items) {
            let itemRect = item.getBoundingClientRect();
            let dist = Math.abs(itemRect.top - staticRect.top);

            if (dist < lastDist) {
              lastDist = dist;
              closestItem = item;
            }
          }

          // if closest item is above static apply image
          let closestRect = closestItem.getBoundingClientRect();

          if (closestRect.top <= staticRect.top) {
            let animKeys = Object.keys(animation);
            let staticImage = staticContainer.querySelector("img");
            let id = closestItem.getAttribute("data-id");
            staticImage.src = animation[animKeys[id]]["png"];
            staticImage.setAttribute("data-id", id);
          }
        }
      }
    };

    // create mutation obsever to handle translateY changes
    const observer = new MutationObserver(onScrollChange);
    observer.observe(infiniteScroll, { attributes: true });
  }

  function handleTouchStart(event) {
    event.preventDefault();
    let touches = event.changedTouches;
    lastTouchPosY = touches[0].pageY;
    cancelAnimationFrame(slowdownAnim);
  }

  function handleTouchMove(event) {
    event.preventDefault();
    endTouchPosY = lastTouchPosY;  // save for touch end
    let touches = event.changedTouches;
    let deltaY = (lastTouchPosY - touches[0].pageY) * -1;
    lastTouchPosY = touches[0].pageY;

    let translateY = getScrollPos() + deltaY;
    setScrollPos(translateY);
    controlFade(deltaY);
  }

  function handleTouchEnd(event) {
    event.preventDefault();
    let touches = event.changedTouches;
    let deltaY = (endTouchPosY - touches[0].pageY) * -1;

    slowdownAnim = window.requestAnimationFrame(slowDownScrollStep);

    // gradually slow down scrolling
    function slowDownScrollStep(timestamp) {
      // make sure infiniteScroll element still exist (page change)
      let infiniteScroll = !!document.querySelector(".infinite-scroll");
      if (infiniteScroll) {

        // clamp delta
        deltaY = Math.min(Math.max(deltaY, -80), 80);

        let translateY = getScrollPos() + deltaY;
        setScrollPos(translateY);
        controlFade(deltaY);

        let stepSize = .25;
        if (deltaY < stepSize) {
          deltaY += stepSize;
          slowdownAnim = window.requestAnimationFrame(slowDownScrollStep);

        } else if (deltaY > stepSize) {
          deltaY -= stepSize
          slowdownAnim = window.requestAnimationFrame(slowDownScrollStep);

        } else {
          deltaY = 0;
          cancelAnimationFrame(slowdownAnim);
        }
      }
    }
  }

  function handleWheel(event) {
    event.preventDefault();
    let deltaY = event.deltaY * -1
    let translateY = getScrollPos() + deltaY;
    setScrollPos(translateY);
    controlFade(deltaY);

    // check if wheel has been re-triggered
    // console.log(lastWheelDeltaY, deltaY)
    if (Math.abs(lastWheelDeltaY) <= Math.abs(deltaY) && !wheelRetriggerred) {
      wheelRetriggerred = true;
      // console.log("wheel retriggered");
    } else {
      wheelRetriggerred = false;
      // console.log("wheel slowing down")
    }
    lastWheelDeltaY = deltaY;

    // start custom slow down animation
    if (Math.abs(deltaY) > 150) {
      customSlowDownFlag = true;
      // console.log("trigger custom animation now: " + deltaY);
    }
    cancelAnimationFrame(slowdownAnim);
  }

  function controlFade(deltaY) {
    let speed = Math.abs(deltaY);
    let max = 80;
    speed = Math.min(Math.max(speed, 0), max);
    let fadeScroll = helpers.map(speed, 0, max, 1, .1);
    let fadeStatic = helpers.map(speed, 20, max, 0, 1);

    let staticAnim = document.querySelector(".static-anim");
    let infiniteScroll = document.querySelector(".infinite-scroll");
    staticAnim.style.opacity = fadeStatic;
    infiniteScroll.style.opacity = fadeScroll;
  }

  function getScrollPos() {
    let infiniteScroll = document.querySelector(".infinite-scroll");
    let matrix = window.getComputedStyle(infiniteScroll).getPropertyValue('transform');
    let translateY;

    // set to 0 if transform not yet set
    if (matrix === "none") {
      infiniteScroll.style.transform = "translateY(0)";
      translateY = 0;

    } else {  // get value from css
      let matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
      translateY = parseInt(matrixValues[5], 10);
    }

    return translateY;
  }

  function setScrollPos(pos) {
    let infiniteScroll = document.querySelector(".infinite-scroll");
    infiniteScroll.style.transform = "translateY(" + pos + "px)";
  }

  function appendItem() {

    let newId = 0;
    let infinteScroll = document.querySelector(".infinite-scroll");
    let item = document.createElement("div");
    item.classList.add("infinite-scroll__item");
    let animKeys = Object.keys(animation);

    // define new id if children exist
    if (infinteScroll.hasChildNodes()) {
      let prevId = parseInt(infinteScroll.lastChild.getAttribute("data-id"), 10);
      if (prevId === animKeys.length - 1) newId = 0;
      else newId = prevId + 1;
    }

    let fileId = newId + 1;
    let fileName = "Untitled_Artwork-" + fileId.toString();

    item.innerHTML = `<img src="` + animation[fileName]["png"] + `">`;
    item.setAttribute("data-id", newId);
    infinteScroll.appendChild(item);
  }

  function prependItem() {

    let newId = 0;
    let infiniteScroll = document.querySelector(".infinite-scroll");
    let item = document.createElement("div");
    item.classList.add("infinite-scroll__item");
    let animKeys = Object.keys(animation);

    let prevId = parseInt(infiniteScroll.firstChild.getAttribute("data-id"), 10);
    if (prevId === 0) newId = animKeys.length - 1;
    else newId = prevId - 1;

    let fileId = newId + 1;
    let fileName = "Untitled_Artwork-" + fileId.toString();

    item.innerHTML = `<img src="` + animation[fileName]["png"] + `">`;
    item.setAttribute("data-id", newId);
    infiniteScroll.prepend(item);

    // correct scroll position for new item
    infiniteScroll.style.transform = "translateY(" + (-item.offsetHeight) + "px)";
  }
}