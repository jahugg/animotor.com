"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;

var _ = _interopRequireDefault(require("./../media/*/*.*"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function render() {
  console.log(_["default"]);
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