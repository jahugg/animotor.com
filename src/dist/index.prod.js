"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _getRequireWildcardCache(){if("function"!=typeof WeakMap)return null;var e=new WeakMap;return _getRequireWildcardCache=function(){return e},e}function _interopRequireWildcard(e){if(e&&e.__esModule)return e;if(null===e||"object"!==_typeof(e)&&"function"!=typeof e)return{default:e};var t=_getRequireWildcardCache();if(t&&t.has(e))return t.get(e);var n,r={},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e){Object.prototype.hasOwnProperty.call(e,a)&&((n=o?Object.getOwnPropertyDescriptor(e,a):null)&&(n.get||n.set)?Object.defineProperty(r,a,n):r[a]=e[a])}return r.default=e,t&&t.set(e,r),r}var defaultPage="home",pages={home:{title:"○",slug:"/"},work:{title:"Work",slug:"/work"},info:{title:"Info",slug:"/info"}};function initApp(){buildNavigation(),navigateToCurrentURL(),window.addEventListener("popstate",function(e){var t,n=e.state.slug;for(var r in pages)pages[r].slug===n&&(t=r);buildPage({pageKey:t},!1)})}function navigateToCurrentURL(){var e=window.location.pathname,t=defaultPage;for(var n in pages)pages[n].slug===e&&(t=n);buildPage({pageKey:t},!0)}function buildNavigation(){var e=document.getElementById("app"),t=document.createElement("nav");t.id="nav",e.appendChild(t);var n=document.createElement("ul");for(var r in t.appendChild(n),pages){var o=document.createElement("li"),a=document.createElement("a");a.href=pages[r].slug,a.setAttribute("data-link",""),a.innerHTML=pages[r].title,o.appendChild(a),n.appendChild(o),a.addEventListener("click",handlePageLink)}}function buildPage(e,t){var n=e.pageKey,r=document.getElementById("main");r?r.innerHTML="":((r=document.createElement("main")).id="main",app.appendChild(r));var o=pages[n],a="Animotor";e.page!==defaultPage&&(a+=" - "+o.title),document.title=a,t&&window.history.pushState(e,o.title,o.slug),updateNavigation(o.slug),"home"===n?Promise.resolve().then(function(){return _interopRequireWildcard(require("./modules/home.js"))}).then(function(e){e.render()}).catch(function(e){console.log(e.message)}):"work"===n?Promise.resolve().then(function(){return _interopRequireWildcard(require("./modules/work.js"))}).then(function(e){e.render()}).catch(function(e){console.log(e.message)}):"info"===n&&Promise.resolve().then(function(){return _interopRequireWildcard(require("./modules/info.js"))}).then(function(e){e.render()}).catch(function(e){console.log(e.message)})}function updateNavigation(e){var t=document.querySelectorAll("nav a"),n=!0,r=!1,o=void 0;try{for(var a,i=t[Symbol.iterator]();!(n=(a=i.next()).done);n=!0){a.value.removeAttribute("data-active")}}catch(e){r=!0,o=e}finally{try{n||null==i.return||i.return()}finally{if(r)throw o}}document.querySelector('a[href="'+e+'"]').setAttribute("data-active","")}function handlePageLink(e){e.preventDefault();var t,n=e.target;for(var r in pages)pages[r].slug===n.getAttribute("href")&&(t=r);buildPage({pageKey:t},!0)}initApp();