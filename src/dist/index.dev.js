"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var defaultPage = "home";
var pages = {
  home: {
    title: "○",
    slug: "/"
  },
  work: {
    title: "Work",
    slug: "/work"
  },
  info: {
    title: "Info",
    slug: "/info"
  }
};

function initApp() {
  buildNavigation();
  navigateToCurrentURL(); // handle history pop state events

  window.addEventListener('popstate', function (event) {
    var slug = event.state.slug;
    var pageKey;

    for (var key in pages) {
      if (pages[key].slug === slug) pageKey = key;
    }

    var stateObj = {
      pageKey: pageKey
    };
    buildPage(stateObj, false);
  });
}

function navigateToCurrentURL() {
  // read slug from url
  var urlPath = window.location.pathname; // check slug for validity

  var pageKey = defaultPage;

  for (var key in pages) {
    if (pages[key].slug === urlPath) pageKey = key;
  } // create state object


  var stateObj = {
    pageKey: pageKey
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
  var pageKey = stateObj.pageKey; // check if main exists

  var main = document.getElementById("main");
  if (main) // empty main
    main.innerHTML = "";else {
    // create main
    main = document.createElement("main");
    main.id = "main";
    app.appendChild(main);
  }
  var page = pages[pageKey]; // set page title

  var title = "Animotor";
  if (stateObj.page !== defaultPage) title += " - " + page.title;
  document.title = title; // push page into browser history

  if (addToHistory) window.history.pushState(stateObj, page.title, page.slug); // update navigation

  updateNavigation(page.slug); // clean this up and make it dynamic
  // load page contents

  if (pageKey === "home") Promise.resolve().then(function () {
    return _interopRequireWildcard(require('./modules/home.js'));
  }).then(function (module) {
    module.render();
  })["catch"](function (err) {
    console.log(err.message);
  });else if (pageKey === "work") Promise.resolve().then(function () {
    return _interopRequireWildcard(require('./modules/work.js'));
  }).then(function (module) {
    module.render();
  })["catch"](function (err) {
    console.log(err.message);
  });else if (pageKey === "info") Promise.resolve().then(function () {
    return _interopRequireWildcard(require('./modules/info.js'));
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
  var pageKey;

  for (var key in pages) {
    if (pages[key].slug === target.getAttribute("href")) pageKey = key;
  }

  var stateObj = {
    pageKey: pageKey
  }; // create state object

  buildPage(stateObj, true);
}

initApp();