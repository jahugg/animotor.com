"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throttledEvent = throttledEvent;
exports.map = map;
exports.sanitizeString = sanitizeString;
exports.loadImage = loadImage;

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

function sanitizeString(string) {
  return string.replace(/[^A-Za-z0-9]/g, '-');
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