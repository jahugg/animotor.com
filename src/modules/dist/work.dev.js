"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;

var _ = _interopRequireDefault(require("./../media/work/*/*.*"));

var helpers = _interopRequireWildcard(require("./helpers.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function render() {
  var main = document.getElementById("main");
  var container = document.createElement("div");
  container.classList.add("slideshow-container");
  main.appendChild(container); // iterate over projects

  var _loop = function _loop(projectName) {
    // check if multiple images
    var multipleImages = Object.keys(_["default"][projectName]).length > 1 ? true : false; // create slideshow

    var slideshow = document.createElement("div");
    slideshow.classList.add("slideshow");
    slideshow.id = helpers.sanitizeString(projectName);
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
      slideshow.classList.add("multiple"); // create indicators wrapper

      indicatorsWrapper = document.createElement("div");
      indicatorsWrapper.classList.add("slideshow__indicators-wrapper");
      slideshow.appendChild(indicatorsWrapper); // add slideshow listeners

      slideshow.addEventListener("click", nextSlide);
      slideshow.addEventListener("mouseover", function () {
        return indicatorsWrapper.setAttribute("data-active", "");
      });
      slideshow.addEventListener("mouseout", function () {
        return indicatorsWrapper.removeAttribute("data-active");
      });
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
    event.stopPropagation();
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

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = indicatorsWrapper.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _indicator = _step.value;

        _indicator.removeAttribute("data-active");
      } // indicatorsWrapper.children[index].setAttribute("data-active", "");

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

    indicator.setAttribute("data-active", "");
  }

  function nextSlide(event) {
    var slideshow = event.target.closest(".slideshow__slides-wrapper"); // scroll to next slide

    if (slideshow.scrollLeft < slideshow.scrollWidth - slideshow.offsetWidth) slideshow.scrollTo({
      left: slideshow.scrollLeft + slideshow.offsetWidth,
      behavior: 'smooth'
    }); // scroll to start
    else slideshow.scrollTo(0, 0);
  }
}