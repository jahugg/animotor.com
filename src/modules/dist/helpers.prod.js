"use strict";function throttledEvent(t,n){var r;return function(e){r||(t(e),r=setTimeout(function(){r=null},n))}}function map(e,t,n,r,o){return(e-t)*(o-r)/(n-t)+r}function loadImage(r){return new Promise(function(e,t){var n=new Image;n.addEventListener("load",function(){return e(n)}),n.addEventListener("error",t),n.src=r})}Object.defineProperty(exports,"__esModule",{value:!0}),exports.throttledEvent=throttledEvent,exports.map=map,exports.loadImage=loadImage;