"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;

var _ = _interopRequireDefault(require("./../media/animation/*.*"));

var helpers = _interopRequireWildcard(require("./helpers.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function render() {
  var lastTouchPosY;
  var endTouchPosY;
  var slowdownAnim;
  var scrollingAnim;
  var customSlowDownFlag = false;
  var lastWheelDeltaY = 0;
  var wheelRetriggerred = false; // container

  var container = document.createElement("div");
  container.classList.add("infinite-scroll-container");
  container.innerHTML = "loading";
  main.appendChild(container); // preload all images

  var promises = [];

  for (var image in _["default"]) {
    for (var type in _["default"][image]) {
      promises.push(helpers.loadImage(_["default"][image][type]));
    }
  } // add animation scroller after images have been loaded


  Promise.all(promises).then(initAnimationScroller)["catch"](function (err) {
    return console.error(err);
  });

  function initAnimationScroller(images) {
    // remove loading message
    container.innerHTML = ""; // mask

    var mask = document.createElement("div");
    mask.classList.add("infinite-scroll-mask");
    container.appendChild(mask); // static animation frame

    var animKeys = Object.keys(_["default"]);
    var staticAnim = document.createElement("div");
    staticAnim.classList.add("static-anim");
    container.appendChild(staticAnim);
    var frame = document.createElement("img");
    frame.src = _["default"][animKeys[0]]["png"];
    frame.setAttribute("data-id", 0);
    staticAnim.appendChild(frame); // infinite scroll

    var infiniteScroll = document.createElement("div");
    infiniteScroll.classList.add("infinite-scroll");
    container.appendChild(infiniteScroll); // fill screen with tiles

    var containerRect = container.getBoundingClientRect();

    while (infiniteScroll.scrollHeight <= containerRect.height) {
      appendItem();
    } // start automatic scrolling animation


    scrollingAnim = window.requestAnimationFrame(scrollingAnimation);

    function scrollingAnimation() {
      // make sure infiniteScroll element still exist (page change)
      var infiniteScroll = !!document.querySelector(".infinite-scroll");

      if (infiniteScroll) {
        setScrollPos(getScrollPos() + 1);
        scrollingAnim = window.requestAnimationFrame(scrollingAnimation);
      }
    } // register event listeners


    container.addEventListener("wheel", helpers.throttledEvent(handleWheel, 5));
    container.addEventListener("touchstart", handleTouchStart, false);
    container.addEventListener("touchmove", helpers.throttledEvent(handleTouchMove, 5), false);
    container.addEventListener("touchend", handleTouchEnd, false);
    container.addEventListener("touchcancel", handleTouchEnd, false); // callback function to execute when mutations are observed

    var onScrollChange = function onScrollChange(mutationsList, observer) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = mutationsList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var mutation = _step.value;

          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            var _infiniteScroll = document.querySelector(".infinite-scroll");

            var translateY = getScrollPos();
            var firstChild = _infiniteScroll.firstChild;
            var lastChild = _infiniteScroll.lastChild; // remove first child if out of bounds

            if (Math.abs(translateY) > firstChild.offsetHeight) {
              firstChild.remove();
              _infiniteScroll.style.transform = "translateY(0)";
            } // remove last child out of bounds
            else if (_infiniteScroll.offsetHeight - lastChild.offsetHeight - Math.abs(translateY) > containerRect.height) lastChild.remove(); // prepend new child if top reached


            if (translateY > 0) prependItem(); // append new child if bottom reached
            else if (containerRect.height + Math.abs(translateY) > _infiniteScroll.offsetHeight) appendItem(); // ----------
            // handle static animation frame

            var items = document.getElementsByClassName("infinite-scroll__item");
            var staticContainer = document.querySelector(".static-anim");
            var staticRect = staticContainer.getBoundingClientRect();
            var closestItem = void 0;
            var lastDist = 9999; // find closest item

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var item = _step2.value;
                var itemRect = item.getBoundingClientRect();
                var dist = Math.abs(itemRect.top - staticRect.top);

                if (dist < lastDist) {
                  lastDist = dist;
                  closestItem = item;
                }
              } // if closest item is above static apply image

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

            var closestRect = closestItem.getBoundingClientRect();

            if (closestRect.top <= staticRect.top) {
              var _animKeys = Object.keys(_["default"]);

              var staticImage = staticContainer.querySelector("img");
              var id = closestItem.getAttribute("data-id");
              staticImage.src = _["default"][_animKeys[id]]["png"];
              staticImage.setAttribute("data-id", id);
            }
          }
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
    }; // create mutation obsever to handle translateY changes


    var observer = new MutationObserver(onScrollChange);
    observer.observe(infiniteScroll, {
      attributes: true
    });
  }

  function handleTouchStart(event) {
    event.preventDefault();
    var touches = event.changedTouches;
    lastTouchPosY = touches[0].pageY;
    cancelAnimationFrame(slowdownAnim);
    cancelAnimationFrame(scrollingAnim);
  }

  function handleTouchMove(event) {
    event.preventDefault();
    endTouchPosY = lastTouchPosY; // save for touch end

    var touches = event.changedTouches;
    var deltaY = (lastTouchPosY - touches[0].pageY) * -1;
    lastTouchPosY = touches[0].pageY;
    var translateY = getScrollPos() + deltaY;
    setScrollPos(translateY);
    controlFade(deltaY);
  }

  function handleTouchEnd(event) {
    event.preventDefault();
    var touches = event.changedTouches;
    var deltaY = (endTouchPosY - touches[0].pageY) * -1;
    slowdownAnim = window.requestAnimationFrame(slowDownScrollStep); // gradually slow down scrolling

    function slowDownScrollStep(timestamp) {
      // make sure infiniteScroll element still exist (page change)
      var infiniteScroll = !!document.querySelector(".infinite-scroll");

      if (infiniteScroll) {
        // clamp delta
        deltaY = Math.min(Math.max(deltaY, -80), 80);
        var translateY = getScrollPos() + deltaY;
        setScrollPos(translateY);
        controlFade(deltaY);
        var stepSize = .25;

        if (deltaY < stepSize) {
          deltaY += stepSize;
          slowdownAnim = window.requestAnimationFrame(slowDownScrollStep);
        } else if (deltaY > stepSize) {
          deltaY -= stepSize;
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
    var deltaY = event.deltaY * -1;
    var translateY = getScrollPos() + deltaY;
    setScrollPos(translateY);
    controlFade(deltaY); // check if wheel has been re-triggered
    // console.log(lastWheelDeltaY, deltaY)

    if (Math.abs(lastWheelDeltaY) <= Math.abs(deltaY) && !wheelRetriggerred) {
      wheelRetriggerred = true; // console.log("wheel retriggered");
    } else {
      wheelRetriggerred = false; // console.log("wheel slowing down")
    }

    lastWheelDeltaY = deltaY; // start custom slow down animation

    if (Math.abs(deltaY) > 150) {
      customSlowDownFlag = true; // console.log("trigger custom animation now: " + deltaY);
    }

    cancelAnimationFrame(slowdownAnim);
    cancelAnimationFrame(scrollingAnim);
  }

  function controlFade(deltaY) {
    var speed = Math.abs(deltaY);
    var max = 80;
    speed = Math.min(Math.max(speed, 0), max);
    var fadeScroll = helpers.map(speed, 0, max, 1, .1);
    var fadeStatic = helpers.map(speed, 20, max, 0, 1);
    var staticAnim = document.querySelector(".static-anim");
    var infiniteScroll = document.querySelector(".infinite-scroll");
    staticAnim.style.opacity = fadeStatic;
    infiniteScroll.style.opacity = fadeScroll;
  }

  function getScrollPos() {
    var infiniteScroll = document.querySelector(".infinite-scroll");
    var matrix = window.getComputedStyle(infiniteScroll).getPropertyValue('transform');
    var translateY; // set to 0 if transform not yet set

    if (matrix === "none") {
      infiniteScroll.style.transform = "translateY(0)";
      translateY = 0;
    } else {
      // get value from css
      var matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
      translateY = parseInt(matrixValues[5], 10);
    }

    return translateY;
  }

  function setScrollPos(pos) {
    var infiniteScroll = document.querySelector(".infinite-scroll");
    infiniteScroll.style.transform = "translateY(" + pos + "px)";
  }

  function appendItem() {
    var newId = 0;
    var infinteScroll = document.querySelector(".infinite-scroll");
    var item = document.createElement("div");
    item.classList.add("infinite-scroll__item");
    var animKeys = Object.keys(_["default"]); // define new id if children exist

    if (infinteScroll.hasChildNodes()) {
      var prevId = parseInt(infinteScroll.lastChild.getAttribute("data-id"), 10);
      if (prevId === animKeys.length - 1) newId = 0;else newId = prevId + 1;
    }

    var fileId = newId + 1;
    var fileName = "Untitled_Artwork-" + fileId.toString();
    item.innerHTML = "<img src=\"" + _["default"][fileName]["png"] + "\">";
    item.setAttribute("data-id", newId);
    infinteScroll.appendChild(item);
  }

  function prependItem() {
    var newId = 0;
    var infiniteScroll = document.querySelector(".infinite-scroll");
    var item = document.createElement("div");
    item.classList.add("infinite-scroll__item");
    var animKeys = Object.keys(_["default"]);
    var prevId = parseInt(infiniteScroll.firstChild.getAttribute("data-id"), 10);
    if (prevId === 0) newId = animKeys.length - 1;else newId = prevId - 1;
    var fileId = newId + 1;
    var fileName = "Untitled_Artwork-" + fileId.toString();
    item.innerHTML = "<img src=\"" + _["default"][fileName]["png"] + "\">";
    item.setAttribute("data-id", newId);
    infiniteScroll.prepend(item); // correct scroll position for new item

    infiniteScroll.style.transform = "translateY(" + -item.offsetHeight + "px)";
  }
}