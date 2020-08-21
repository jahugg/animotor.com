import animations from './../media/home/animations/*/*.*';
import * as helpers from './helpers.js';

export function render() {
  let lastTouchPosY;
  let endTouchPosY;
  let autoScrollAnim;
  let ignoreWheel;
  let maxDeltaY = 120;

  // change navigation to fixed
  let header = document.querySelector('header');
  header.classList.replace('header--relative', 'header--fixed');

  // add container
  let container = document.createElement('div');
  container.classList.add('infinite-scroll-container');
  container.innerHTML = '<div class="infinite-scroll-loader"><div>';
  document.getElementById('main').appendChild(container);

  // pick new animation
  let keys = Object.keys(animations);
  let animationKey;
  let lastAnimKey = sessionStorage.getItem('animKey');

  // pick random animation the first time
  if (lastAnimKey == null) animationKey = (keys.length * Math.random()) << 0;
  // else pick next animation
  else {
    lastAnimKey = parseInt(lastAnimKey);
    if (lastAnimKey === keys.length - 1) animationKey = 0;
    else animationKey = lastAnimKey + 1;
  }

  // save animation key to session
  sessionStorage.setItem('animKey', animationKey);

  let animationObject = animations[keys[animationKey]];
  container.setAttribute('data-anim', animationKey);
  let animation = Object.values(animationObject);
  let arrayKeys = Object.keys(animation[0]);
  let fileType = arrayKeys[0];

  // preload all images
  let promises = [];
  for (let frame of animation) promises.push(helpers.loadImage(frame[fileType]));

  // add animation scroller after images have been loaded
  Promise.all(promises)
    .then(initAnimationScroller)
    .catch((err) => console.error(err));

  function initAnimationScroller(images) {
    // remove loading message
    container.innerHTML = '';

    // static animation frame
    let staticAnim = document.createElement('div');
    staticAnim.classList.add('static-anim');
    container.appendChild(staticAnim);
    let frame = document.createElement('img');
    frame.src = animation[0][fileType];
    frame.setAttribute('data-id', 0);
    staticAnim.appendChild(frame);

    // infinite scroll
    let infiniteScroll = document.createElement('div');
    infiniteScroll.classList.add('infinite-scroll');
    container.appendChild(infiniteScroll);

    // fill screen height with tiles
    let containerRect = container.getBoundingClientRect();
    while (infiniteScroll.scrollHeight <= containerRect.height) appendItem();

    // register event listeners
    container.addEventListener('wheel', helpers.throttledEvent(handleWheel, 5));
    container.addEventListener('touchstart', handleTouchStart, false);
    container.addEventListener('touchmove', helpers.throttledEvent(handleTouchMove, 5), false);
    container.addEventListener('touchend', handleTouchEnd, false);
    container.addEventListener('touchcancel', handleTouchEnd, false);

    // callback function to execute when mutations are observed
    // animation frame handling
    const onScrollChange = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          let infiniteScroll = document.querySelector('.infinite-scroll');
          let translateY = getScrollPos();
          let firstChild = infiniteScroll.firstChild;
          let lastChild = infiniteScroll.lastChild;

          // remove first child if out of bounds
          if (Math.abs(translateY) > firstChild.offsetHeight) {
            firstChild.remove();
            infiniteScroll.style.transform = 'translateY(0)';
          }
          // remove last child out of bounds
          else if (infiniteScroll.offsetHeight - lastChild.offsetHeight - Math.abs(translateY) > containerRect.height) lastChild.remove();

          // prepend new child if top reached
          if (translateY > 0) prependItem();
          // append new child if bottom reached
          else if (containerRect.height + Math.abs(translateY) > infiniteScroll.offsetHeight) appendItem();

          // ----------
          // handle static animation frame
          let items = document.getElementsByClassName('infinite-scroll__item');
          let staticContainer = document.querySelector('.static-anim');
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
            let staticImage = staticContainer.querySelector('img');
            let id = closestItem.getAttribute('data-id');
            staticImage.src = animation[id][fileType];
            staticImage.setAttribute('data-id', id);
          }
        }
      }
    };

    // create mutation obsever to handle translateY changes
    const observer = new MutationObserver(onScrollChange);
    observer.observe(infiniteScroll, { attributes: true });

    // start initial animation
    startAutoScroll(-maxDeltaY);
  }

  function startAutoScroll(deltaY) {
    let maxDuration = 7000;

    // clamp delta
    deltaY = helpers.clamp(deltaY, -maxDeltaY, maxDeltaY);

    // define duration depending on deltaY
    let duration = Math.round(helpers.map(Math.abs(deltaY), 0, maxDeltaY, 0, maxDuration));
    let startTime;
    let stepSize = deltaY / duration;
    autoScrollAnim = window.requestAnimationFrame(autoScrollStep);

    function autoScrollStep(timestamp) {
      // make sure infiniteScroll element still exist (page change)
      let infiniteScroll = !!document.querySelector('.infinite-scroll');
      if (infiniteScroll) {
        if (startTime === undefined) startTime = timestamp;

        const elapsedTime = timestamp - startTime;

        let thisStep = elapsedTime * stepSize;
        thisStep = helpers.map(thisStep, 0, deltaY, deltaY, 0);
        setScrollPos(getScrollPos() + thisStep);
        controlFade(thisStep);

        if (elapsedTime < duration) autoScrollAnim = window.requestAnimationFrame(autoScrollStep);
      }
    }
  }

  function handleTouchStart(event) {
    event.preventDefault();
    let touches = event.changedTouches;
    lastTouchPosY = touches[0].pageY;
    endTouchPosY = lastTouchPosY; // reset
    window.cancelAnimationFrame(autoScrollAnim);
  }

  function handleTouchMove(event) {
    event.preventDefault();
    endTouchPosY = lastTouchPosY; // save for touch end
    let touches = event.changedTouches;
    let deltaY = (lastTouchPosY - touches[0].pageY) * -1;
    lastTouchPosY = touches[0].pageY;

    let translateY = getScrollPos() + deltaY;
    setScrollPos(translateY);
    controlFade(deltaY);
  }

  function handleTouchEnd(event) {
    event.preventDefault();
    const multiplier = 1.7;
    let touches = event.changedTouches;
    let deltaY = (endTouchPosY - touches[0].pageY) * -multiplier;
    startAutoScroll(deltaY);
  }

  function handleWheel(event) {
    event.preventDefault();
    let deltaY = event.deltaY * -1;

    if (!ignoreWheel) {
      // start auto anmiation when max speed reached
      if (Math.abs(deltaY) > maxDeltaY) {
        startAutoScroll(deltaY);
        ignoreWheel = true;

        // set deltaY as default scrolling
        // this should be done in a more consistant way without using a threshold of 2
        // detecting direction via array of deltaY values?
      } else if (Math.abs(deltaY) > 2) {
        window.cancelAnimationFrame(autoScrollAnim);
        let translateY = getScrollPos() + deltaY;
        setScrollPos(translateY);
        controlFade(deltaY);
      }

      // set ingore wheel to false when deltaY reaches 1
    } else if (ignoreWheel && Math.abs(deltaY) === 1) {
      ignoreWheel = false;
    }
  }

  function controlFade(deltaY) {
    let speed = Math.abs(deltaY);
    let min = 30;
    let max = 80;
    speed = helpers.clamp(speed, min, max);

    let fadeScroll = helpers.map(speed, min, max, 1, 0);
    let fadeStatic = helpers.map(speed, min, max, 0, 1);

    let staticAnim = document.querySelector('.static-anim');
    let infiniteScroll = document.querySelector('.infinite-scroll');
    staticAnim.style.opacity = fadeStatic;
    infiniteScroll.style.opacity = fadeScroll;
  }

  function getScrollPos() {
    let infiniteScroll = document.querySelector('.infinite-scroll');
    let matrix = window.getComputedStyle(infiniteScroll).getPropertyValue('transform');
    let translateY;

    // set to 0 if transform not yet set
    if (matrix === 'none') {
      infiniteScroll.style.transform = 'translateY(0)';
      translateY = 0;
    } else {
      // get value from css
      let matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
      translateY = parseInt(matrixValues[5], 10);
    }

    return translateY;
  }

  function setScrollPos(pos) {
    let infiniteScroll = document.querySelector('.infinite-scroll');
    infiniteScroll.style.transform = 'translateY(' + pos + 'px)';
  }

  function appendItem() {
    let newId = 0;
    let infinteScroll = document.querySelector('.infinite-scroll');
    let item = document.createElement('div');
    item.classList.add('infinite-scroll__item');

    // define new id if children exist
    if (infinteScroll.hasChildNodes()) {
      let prevId = parseInt(infinteScroll.lastChild.getAttribute('data-id'), 10);
      if (prevId === animation.length - 1) newId = 0;
      else newId = prevId + 1;
    }

    item.innerHTML = `<img src="` + animation[newId][fileType] + `">`;
    item.setAttribute('data-id', newId);
    infinteScroll.appendChild(item);
  }

  function prependItem() {
    let newId = 0;
    let infiniteScroll = document.querySelector('.infinite-scroll');
    let item = document.createElement('div');
    item.classList.add('infinite-scroll__item');

    let prevId = parseInt(infiniteScroll.firstChild.getAttribute('data-id'), 10);
    if (prevId === 0) newId = animation.length - 1;
    else newId = prevId - 1;

    item.innerHTML = `<img src="` + animation[newId][fileType] + `">`;
    item.setAttribute('data-id', newId);
    infiniteScroll.prepend(item);

    // correct scroll position for new item
    infiniteScroll.style.transform = 'translateY(' + -item.offsetHeight + 'px)';
  }
}
