"use strict";

require("./fonts.less");

require("./styles.less");

var _ = _interopRequireDefault(require("./media/*/*.*"));

var _2 = _interopRequireDefault(require("./animation/*.*"));

var _contentInfo = _interopRequireDefault(require("./content-info.md"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var pages = {
  home: {
    title: "○",
    slug: "/",
    module: "home.js",
    loadContents: function loadContents() {
      loadHome();
    }
  },
  work: {
    title: "Work",
    slug: "/work",
    module: "work.js",
    loadContents: function loadContents() {
      loadWork();
    }
  },
  info: {
    title: "Info",
    slug: "/info",
    module: "info.js",
    loadContents: function loadContents() {
      loadInfo();
    }
  }
};
var defaultPage = pages.home;

function initApp() {
  buildNavigation();
  navigateToCurrentURL(); // handle history pop state events

  window.addEventListener('popstate', function (event) {
    var stateObj = {
      slug: event.state.slug
    };
    buildPage(stateObj, false);
  });
}

function navigateToCurrentURL() {
  // read slug from url
  var urlPath = window.location.pathname; // check slug for validity

  var currentPage = defaultPage;

  for (var key in pages) {
    if (pages[key].slug === urlPath) currentPage = pages[key];
  } // create state object


  var stateObj = {
    slug: currentPage.slug
  }; // build page

  buildPage(stateObj, true);
}

function buildNavigation() {
  var app = document.getElementById("app");
  var nav = document.createElement("nav");
  nav.id = "nav";
  app.appendChild(nav);
  var list = document.createElement("ul");
  nav.appendChild(list);

  for (var key in pages) {
    var item = document.createElement("li");
    var link = document.createElement("a");
    link.href = pages[key].slug;
    link.setAttribute("data-link", "");
    link.innerHTML = pages[key].title;
    item.appendChild(link);
    list.appendChild(item);
    link.addEventListener("click", handlePageLink);
  }
}

function buildPage(stateObj, addToHistory) {
  // check if main exists
  var main = document.getElementById("main");
  if (main) // empty main
    main.innerHTML = "";else {
    // create main
    main = document.createElement("main");
    main.id = "main";
    app.appendChild(main);
  } // fetch matching page object

  var currentPage;

  for (var key in pages) {
    if (pages[key].slug === stateObj.slug) currentPage = pages[key];
  } // set page title


  var title = "Animotor";
  if (currentPage !== defaultPage) title += " - " + currentPage.title;
  document.title = title; // push page into browser history

  if (addToHistory) window.history.pushState(stateObj, currentPage.title, currentPage.slug); // update navigation

  updateNavigation(currentPage.slug); // load page contents
  // consider this workflow https://parceljs.org/code_splitting.html
  // currentPage.loadContents();

  Promise.resolve().then(function () {
    return _interopRequireWildcard(require('./pages/work.js'));
  }).then(function (module) {
    module.render();
  })["catch"](function (err) {
    console.log(err.message);
  });
}

function updateNavigation(currentSlug) {
  // handle navigation items
  var links = document.querySelectorAll('nav a');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = links[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var link = _step.value;
      link.removeAttribute("data-active");
    } // set link for current page as active

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

  document.querySelector('a[href="' + currentSlug + '"]').setAttribute("data-active", "");
}

function handlePageLink(event) {
  event.preventDefault();
  var target = event.target;
  var stateObj = {
    slug: target.getAttribute("href")
  }; // create state object

  buildPage(stateObj, true);
}

function loadInfo() {
  var main = document.getElementById("main");
  main.innerHTML = "<article class=\"info\">" + _contentInfo["default"] + "</article>";
}

function loadWork() {
  var main = document.getElementById("main");
  var container = document.createElement("div");
  container.classList.add("slideshow-container");
  main.appendChild(container); // iterate over projects

  var _loop = function _loop(projectName) {
    // check if multiple images
    var multipleImages = Object.keys(_["default"][projectName]).length > 1 ? true : false; // create slideshow

    var slideshow = document.createElement("div");
    slideshow.classList.add("slideshow");
    container.appendChild(slideshow);
    var slidesWrapper = document.createElement("div");
    slidesWrapper.classList.add("slideshow__slides-wrapper");
    slideshow.appendChild(slidesWrapper); // add event to handle end of scrolling

    var isScrolling = void 0;
    slidesWrapper.addEventListener("scroll", function (event) {
      // Clear our timeout throughout the scroll
      window.clearTimeout(isScrolling); // Set a timeout to run after scrolling ends

      isScrolling = setTimeout(function () {
        // Run the callback
        var index = Math.round(event.target.scrollLeft / event.target.offsetWidth);
        var slideshow = event.target.closest(".slideshow");
        var indicator = slideshow.querySelector(".slideshow__indicators-wrapper").children[index];
        updateIndicators(indicator);
      }, 10);
    }, false);
    var indicatorsWrapper = void 0;

    if (multipleImages) {
      // create navigation items
      var navigation = document.createElement("div");
      navigation.classList.add("slideshow__nav");
      slideshow.appendChild(navigation);
      var prevButton = document.createElement("button");
      prevButton.classList.add("slideshow__nav__btn");
      navigation.appendChild(prevButton);
      prevButton.addEventListener("click", previousSlide);
      var nextButton = document.createElement("button");
      nextButton.classList.add("slideshow__nav__btn");
      navigation.appendChild(nextButton);
      nextButton.addEventListener("click", nextSlide); // create indicators wrapper

      indicatorsWrapper = document.createElement("div");
      indicatorsWrapper.classList.add("slideshow__indicators-wrapper");
      slideshow.appendChild(indicatorsWrapper);
    } // iterate over project files


    for (var fileName in _["default"][projectName]) {
      for (var fileType in _["default"][projectName][fileName]) {
        var filepath = _["default"][projectName][fileName][fileType];
        var mediaContainer = document.createElement("div");
        mediaContainer.classList.add("slideshow__slide");
        slidesWrapper.appendChild(mediaContainer); // add media item

        if (fileType === "jpg" || fileType === "png" || fileType === "gif") {
          var media = document.createElement("img");
          media.src = filepath;
          media.classList.add("slideshow__slide__media");
          mediaContainer.appendChild(media);
        } // add indicator


        if (multipleImages) {
          var indicatorItem = document.createElement("div");
          indicatorItem.classList.add("slideshow__indicator");
          indicatorItem.addEventListener("click", jumpToSlide);
          indicatorsWrapper.appendChild(indicatorItem);
        }
      }
    } // set first indicator active


    if (multipleImages) indicatorsWrapper.querySelector(".slideshow__indicator").setAttribute("data-active", "");
  };

  for (var projectName in _["default"]) {
    _loop(projectName);
  }

  function jumpToSlide(event) {
    var target = event.target;
    var parent = target.closest(".slideshow__indicators-wrapper");
    var slideshow = target.closest(".slideshow");
    var slidesWrapper = slideshow.querySelector(".slideshow__slides-wrapper"); // get index of child

    var targetIndex = Array.from(parent.children).indexOf(target);
    slidesWrapper.scrollTo({
      left: targetIndex * slideshow.offsetWidth,
      behavior: 'smooth'
    });
  }

  ;

  function updateIndicators(indicator) {
    var indicatorsWrapper = indicator.parentNode; // remove active attribute

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = indicatorsWrapper.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _indicator = _step2.value;

        _indicator.removeAttribute("data-active");
      } // indicatorsWrapper.children[index].setAttribute("data-active", "");

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

    indicator.setAttribute("data-active", "");
  }

  function previousSlide(event) {
    var slideshow = event.target.closest(".slideshow__slides-wrapper");
    slideshow.scrollTo({
      left: slideshow.scrollLeft - slideshow.offsetWidth,
      behavior: 'smooth'
    });
  }

  function nextSlide(event) {
    var slideshow = event.target.closest(".slideshow__slides-wrapper");
    slideshow.scrollTo({
      left: slideshow.scrollLeft + slideshow.offsetWidth,
      behavior: 'smooth'
    });
  }
}

function loadHome() {
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

  for (var image in _2["default"]) {
    for (var type in _2["default"][image]) {
      promises.push(loadImage(_2["default"][image][type]));
    }
  } // add animation scroller after images have been loaded


  Promise.all(promises).then(initAnimationScroller)["catch"](function (err) {
    return console.error(err);
  });

  function initAnimationScroller(images) {
    // remove loading message
    container.innerHTML = ""; // static animation frame

    var animKeys = Object.keys(_2["default"]);
    var staticAnim = document.createElement("div");
    staticAnim.classList.add("static-anim");
    container.appendChild(staticAnim);
    var frame = document.createElement("img");
    frame.src = _2["default"][animKeys[0]]["png"];
    frame.setAttribute("data-id", 0);
    staticAnim.appendChild(frame); // infinite scroll

    var infiniteScroll = document.createElement("div");
    infiniteScroll.classList.add("infinite-scroll");
    container.appendChild(infiniteScroll); // fill screen with tiles

    while (infiniteScroll.scrollHeight <= window.innerHeight) {
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


    container.addEventListener("wheel", throttledEvent(handleWheel, 5));
    container.addEventListener("touchstart", handleTouchStart, false);
    container.addEventListener("touchmove", throttledEvent(handleTouchMove, 5), false);
    container.addEventListener("touchend", handleTouchEnd, false);
    container.addEventListener("touchcancel", handleTouchEnd, false); // callback function to execute when mutations are observed

    var onScrollChange = function onScrollChange(mutationsList, observer) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = mutationsList[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var mutation = _step3.value;

          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            var _infiniteScroll = document.querySelector(".infinite-scroll");

            var translateY = getScrollPos();
            var firstChild = _infiniteScroll.firstChild;
            var lastChild = _infiniteScroll.lastChild; // remove first child if out of bounds

            if (Math.abs(translateY) > firstChild.offsetHeight) {
              firstChild.remove();
              _infiniteScroll.style.transform = "translateY(0)";
            } // remove last child out of bounds
            else if (_infiniteScroll.offsetHeight - lastChild.offsetHeight - Math.abs(translateY) > window.innerHeight) lastChild.remove(); // prepend new child if top reached


            if (translateY > 0) prependItem(); // append new child if bottom reached
            else if (window.innerHeight + Math.abs(translateY) > _infiniteScroll.offsetHeight) appendItem(); // ----------
            // handle static animation frame

            var items = document.getElementsByClassName("infinite-scroll__item");
            var staticContainer = document.querySelector(".static-anim");
            var staticRect = staticContainer.getBoundingClientRect();
            var closestItem = void 0;
            var lastDist = 9999; // find closest item

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = items[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var item = _step4.value;
                var itemRect = item.getBoundingClientRect();
                var dist = Math.abs(itemRect.top - staticRect.top);

                if (dist < lastDist) {
                  lastDist = dist;
                  closestItem = item;
                }
              } // if closest item is above static apply image

            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                  _iterator4["return"]();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }

            var closestRect = closestItem.getBoundingClientRect();

            if (closestRect.top <= staticRect.top) {
              var _animKeys = Object.keys(_2["default"]);

              var staticImage = staticContainer.querySelector("img");
              var id = closestItem.getAttribute("data-id");
              staticImage.src = _2["default"][_animKeys[id]]["png"];
              staticImage.setAttribute("data-id", id);
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
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

    console.log(lastWheelDeltaY, deltaY);

    if (Math.abs(lastWheelDeltaY) <= Math.abs(deltaY) && !wheelRetriggerred) {
      wheelRetriggerred = true;
      console.log("wheel retriggered");
    } else {
      wheelRetriggerred = false;
      console.log("wheel slowing down");
    }

    lastWheelDeltaY = deltaY; // start custom slow down animation

    if (Math.abs(deltaY) > 150) {
      customSlowDownFlag = true;
      console.log("trigger custom animation now: " + deltaY);
    }

    cancelAnimationFrame(slowdownAnim);
    cancelAnimationFrame(scrollingAnim);
  }

  function controlFade(deltaY) {
    var speed = Math.abs(deltaY);
    var max = 80;
    speed = Math.min(Math.max(speed, 0), max);
    var fadeScroll = map(speed, 0, max, 1, .1);
    var fadeStatic = map(speed, 20, max, 0, 1);
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
    var animKeys = Object.keys(_2["default"]); // define new id if children exist

    if (infinteScroll.hasChildNodes()) {
      var prevId = parseInt(infinteScroll.lastChild.getAttribute("data-id"), 10);
      if (prevId === animKeys.length - 1) newId = 0;else newId = prevId + 1;
    }

    var fileId = newId + 1;
    var fileName = "Untitled_Artwork-" + fileId.toString();
    item.innerHTML = "<img src=\"" + _2["default"][fileName]["png"] + "\">\n    <div>" + newId + "</div>";
    item.setAttribute("data-id", newId);
    infinteScroll.appendChild(item);
  }

  function prependItem() {
    var newId = 0;
    var infiniteScroll = document.querySelector(".infinite-scroll");
    var item = document.createElement("div");
    item.classList.add("infinite-scroll__item");
    var animKeys = Object.keys(_2["default"]);
    var prevId = parseInt(infiniteScroll.firstChild.getAttribute("data-id"), 10);
    if (prevId === 0) newId = animKeys.length - 1;else newId = prevId - 1;
    var fileId = newId + 1;
    var fileName = "Untitled_Artwork-" + fileId.toString();
    item.innerHTML = "<img src=\"" + _2["default"][fileName]["png"] + "\">\n  <div>" + newId + "</div>";
    item.setAttribute("data-id", newId);
    infiniteScroll.prepend(item); // correct scroll position for new item

    infiniteScroll.style.transform = "translateY(" + -item.offsetHeight + "px)";
  }
}

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

function map(num, in_min, in_max, out_min, out_max) {
  // taken from
  // (https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers/23202637)
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function loadImage(src) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.addEventListener("load", function () {
      return resolve(img);
    });
    img.addEventListener("error", reject);
    img.src = src;
  });
}

;
initApp();