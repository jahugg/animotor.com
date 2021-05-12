export function throttledEvent(listener, delay) {
  let timeout;
  return function (event) {
    if (!timeout) {
      // no timer running
      listener(event); // run the function
      timeout = setTimeout(function () {
        timeout = null;
      }, delay); // start a timer that turns itself off when it's done
    }
    // else, do nothing (throttling)
  };
}

export function map(num, in_min, in_max, out_min, out_max) {
  // taken from https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers/23202637
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

export function sanitizeString(string) {
  return string.replace(/[^A-Za-z0-9]/g, '-');
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = src;
  })
}

export function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
};