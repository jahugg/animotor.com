"use strict";require("./fonts.less"),require("./styles.less");var _projects=_interopRequireDefault(require("./projects.json")),_=_interopRequireDefault(require("./media/*.*")),_2=_interopRequireDefault(require("./animation/*.*")),_contentInfo=_interopRequireDefault(require("./content-info.md"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}var defaultRoute="/",pages=[{title:"home",route:"/",content:"loadProjects()"},{title:"about",route:"/about",content:"content-info.md"}];function initApp(){navigateToCurrentURL();var e=document.querySelectorAll('a[data-link="page"]'),t=!0,n=!1,r=void 0;try{for(var a,i=e[Symbol.iterator]();!(t=(a=i.next()).done);t=!0){a.value.addEventListener("click",handlePageLink)}}catch(e){n=!0,r=e}finally{try{t||null==i.return||i.return()}finally{if(n)throw r}}}function handlePageLink(e){e.preventDefault(),buildPage({route:e.target.getAttribute("href")})}function navigateToCurrentURL(){for(var e=window.location.pathname,t=[],n=0,r=pages;n<r.length;n++){var a=r[n];t.push(a.route)}var i=defaultRoute;t.includes(e)&&(i=e),buildPage({route:i})}function buildPage(e){var t,n=document.getElementById("main"),r=!(n.innerHTML=""),a=!1,i=void 0;try{for(var o,l=pages[Symbol.iterator]();!(r=(o=l.next()).done);r=!0){var u=o.value;u.route==e.route&&(t=u)}}catch(e){a=!0,i=e}finally{try{r||null==l.return||l.return()}finally{if(a)throw i}}if(window.history.pushState(e,"",t.route),"home"===t.title)loadHome();else if("about"===t.title){var d=document.querySelector("#nav a");d.href="/",d.innerHTML="work",n.innerHTML='<article class="about">'+_contentInfo.default+"</article>"}}function loadHome(){var e=document.querySelector("#nav a");e.href="/about",e.innerHTML="about";var t=document.createElement("div");t.classList.add("infinite-scroll-container"),main.appendChild(t);var a=document.createElement("div");for(a.classList.add("infinite-scroll"),t.appendChild(a);a.scrollHeight<=window.innerHeight;)f();t.addEventListener("wheel",throttledEvent(function(e){e.preventDefault();var t=-1*e.deltaY;u(s()+t)},0)),t.addEventListener("touchstart",function(e){e.preventDefault();var t=e.changedTouches;r=t[0].pageY,cancelAnimationFrame(o)},!1),t.addEventListener("touchmove",throttledEvent(function(e){e.preventDefault(),i=r;var t=e.changedTouches,n=-1*(r-t[0].pageY);r=t[0].pageY,u(s()+n)},0),!1),t.addEventListener("touchend",l,!1),t.addEventListener("touchcancel",l,!1);var r,i,o,n=a;function l(e){e.preventDefault();var t=e.changedTouches,r=-1*(i-t[0].pageY);o=requestAnimationFrame(function e(t){r=Math.min(Math.max(r,-80),80);var n=s()+r;u(n);(0<r||r<0)&&(o=window.requestAnimationFrame(e),0<r?r--:r<0&&r++)})}function s(){var e,t=document.querySelector(".infinite-scroll"),n=window.getComputedStyle(t).getPropertyValue("transform");if("none"===n)a.style.transform="translateY(0)",e=0;else{var r=n.match(/matrix.*\((.+)\)/)[1].split(", ");e=parseInt(r[5],10)}return e}function u(e){document.querySelector(".infinite-scroll").style.transform="translateY("+e+"px)"}function f(){var e=0,t=document.querySelector(".infinite-scroll"),n=document.createElement("div");if(n.classList.add("infinite-scroll__item"),t.hasChildNodes()){var r=parseInt(t.lastChild.getAttribute("data-id"),10);e=r===_projects.default.projects.length-1?0:r+1}var a=e.toString().padStart(5,"0");n.innerHTML='<img src="'+_2.default["1_huhn_"+a].png+'">\n    <div>'+_projects.default.projects[e].title+"</div>",n.setAttribute("data-id",e),t.appendChild(n)}function v(){var e=0,t=document.querySelector(".infinite-scroll"),n=document.createElement("div");n.classList.add("infinite-scroll__item");var r=parseInt(t.firstChild.getAttribute("data-id"),10),a=(e=0===r?_projects.default.projects.length-1:r-1).toString().padStart(5,"0");n.innerHTML='<img src="'+_2.default["1_huhn_"+a].png+'">\n  <div>'+_projects.default.projects[e].title+"</div>",n.setAttribute("data-id",e),t.prepend(n),t.style.transform="translateY("+-n.offsetHeight+"px)"}new MutationObserver(function(e){var t=!0,n=!1,r=void 0;try{for(var a,i=e[Symbol.iterator]();!(t=(a=i.next()).done);t=!0){var o=a.value;if("attributes"===o.type&&"style"===o.attributeName){var l=document.querySelector(".infinite-scroll"),u=s(),d=l.firstChild,c=l.lastChild;Math.abs(u)>d.offsetHeight?(d.remove(),l.style.transform="translateY(0)"):l.offsetHeight-c.offsetHeight-Math.abs(u)>window.innerHeight&&c.remove(),0<u?v():window.innerHeight+Math.abs(u)>l.offsetHeight&&f()}}}catch(e){n=!0,r=e}finally{try{t||null==i.return||i.return()}finally{if(n)throw r}}}).observe(n,{attributes:!0})}function throttledEvent(t,n){var r;return function(e){r||(t(e),r=setTimeout(function(){r=null},n))}}function map(e,t,n,r,a){return(e-t)*(a-r)/(n-t)+r}initApp();