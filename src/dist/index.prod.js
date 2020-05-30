"use strict";require("./fonts.less"),require("./styles.less");var _projects=_interopRequireDefault(require("./projects.json")),_=_interopRequireDefault(require("./media/*.*")),_2=_interopRequireDefault(require("./animation/*.*")),_contentInfo=_interopRequireDefault(require("./content-info.md"));function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}var defaultRoute="/",pages=[{title:"home",route:"/",content:"loadHome()"},{title:"work",route:"/work",content:"loadWork()"},{title:"info",route:"/info",content:"content-info.md"}];function initApp(){navigateToCurrentURL();var t=document.querySelectorAll("a[data-link]"),e=!0,n=!1,r=void 0;try{for(var i,a=t[Symbol.iterator]();!(e=(i=a.next()).done);e=!0){i.value.addEventListener("click",handlePageLink)}}catch(t){n=!0,r=t}finally{try{e||null==a.return||a.return()}finally{if(n)throw r}}}function handlePageLink(t){t.preventDefault(),buildPage({route:t.target.getAttribute("href")})}function navigateToCurrentURL(){for(var t=window.location.pathname,e=[],n=0,r=pages;n<r.length;n++){var i=r[n];e.push(i.route)}var a=defaultRoute;e.includes(t)&&(a=t),buildPage({route:a})}function buildPage(t){var e,n=document.getElementById("main"),r=!(n.innerHTML=""),i=!1,a=void 0;try{for(var o,l=pages[Symbol.iterator]();!(r=(o=l.next()).done);r=!0){var u=o.value;u.route==t.route&&(e=u)}}catch(t){i=!0,a=t}finally{try{r||null==l.return||l.return()}finally{if(i)throw a}}window.history.pushState(t,"",e.route);var d=document.querySelectorAll("a[data-link]"),c=!0,s=!1,f=void 0;try{for(var m,v=d[Symbol.iterator]();!(c=(m=v.next()).done);c=!0){m.value.removeAttribute("data-active")}}catch(t){s=!0,f=t}finally{try{c||null==v.return||v.return()}finally{if(s)throw f}}document.querySelector('a[href="'+e.route+'"]').setAttribute("data-active",""),"home"===e.title?loadHome():"info"===e.title&&(n.innerHTML='<article class="info">'+_contentInfo.default+"</article>")}function loadHome(){var t=document.createElement("div");t.classList.add("infinite-scroll-container"),main.appendChild(t);var C=Object.keys(_2.default),e=document.createElement("div");e.classList.add("static-anim"),t.appendChild(e);var n=document.createElement("img");n.src=_2.default[C[0]].png,n.setAttribute("data-id",0),e.appendChild(n);var r=document.createElement("div");for(r.classList.add("infinite-scroll"),t.appendChild(r);r.scrollHeight<=window.innerHeight;)H();t.addEventListener("wheel",throttledEvent(function(t){t.preventDefault();var e=-1*t.deltaY;d(E()+e),u(e)},5)),t.addEventListener("touchstart",function(t){t.preventDefault();var e=t.changedTouches;i=e[0].pageY,cancelAnimationFrame(o)},!1),t.addEventListener("touchmove",throttledEvent(function(t){t.preventDefault(),a=i;var e=t.changedTouches,n=-1*(i-e[0].pageY);i=e[0].pageY,d(E()+n),u(n)},5),!1),t.addEventListener("touchend",l,!1),t.addEventListener("touchcancel",l,!1);var i,a,o;new MutationObserver(function(t){var e=!0,n=!1,r=void 0;try{for(var i,a=t[Symbol.iterator]();!(e=(i=a.next()).done);e=!0){var o=i.value;if("attributes"===o.type&&"style"===o.attributeName){var l=document.querySelector(".infinite-scroll"),u=E(),d=l.firstChild,c=l.lastChild;Math.abs(u)>d.offsetHeight?(d.remove(),l.style.transform="translateY(0)"):l.offsetHeight-c.offsetHeight-Math.abs(u)>window.innerHeight&&c.remove(),0<u?function(){var t=0,e=document.querySelector(".infinite-scroll"),n=document.createElement("div");n.classList.add("infinite-scroll__item");var r=Object.keys(_2.default),i=parseInt(e.firstChild.getAttribute("data-id"),10);t=0===i?r.length-1:i-1;var a="Untitled_Artwork-"+(t+1).toString();n.innerHTML='<img src="'+_2.default[a].png+'">\n  <div>'+t+"</div>",n.setAttribute("data-id",t),e.prepend(n),e.style.transform="translateY("+-n.offsetHeight+"px)"}():window.innerHeight+Math.abs(u)>l.offsetHeight&&H();var s,f,m=document.getElementsByClassName("infinite-scroll__item"),v=document.querySelector(".static-anim"),h=v.getBoundingClientRect(),p=void 0,y=9999,g=!0,b=!1,_=void 0;try{for(var q,w=m[Symbol.iterator]();!(g=(q=w.next()).done);g=!0){var S=q.value,A=S.getBoundingClientRect(),L=Math.abs(A.top-h.top);L<y&&(y=L,p=S)}}catch(t){b=!0,_=t}finally{try{g||null==w.return||w.return()}finally{if(b)throw _}}p.getBoundingClientRect().top<=h.top&&(s=v.querySelector("img"),f=p.getAttribute("data-id"),s.src=_2.default[C[f]].png,s.setAttribute("data-id",f))}}}catch(t){n=!0,r=t}finally{try{e||null==a.return||a.return()}finally{if(n)throw r}}}).observe(r,{attributes:!0});function l(t){t.preventDefault();var e=t.changedTouches,r=-1*(a-e[0].pageY);o=requestAnimationFrame(function t(e){r=Math.min(Math.max(r,-80),80);var n=E()+r;d(n);u(r);{(0<r||r<0)&&(o=window.requestAnimationFrame(t),0<r?r-=.5:r<0&&(r+=.5))}})}function u(t){var e=Math.abs(t),n=map(e=Math.min(Math.max(e,0),80),0,80,1,.05),r=map(e,20,80,0,1),i=document.querySelector(".static-anim"),a=document.querySelector(".infinite-scroll");i.style.opacity=r,a.style.opacity=n}function E(){var t,e=document.querySelector(".infinite-scroll"),n=window.getComputedStyle(e).getPropertyValue("transform");return"none"===n?(e.style.transform="translateY(0)",0):(t=n.match(/matrix.*\((.+)\)/)[1].split(", "),parseInt(t[5],10))}function d(t){document.querySelector(".infinite-scroll").style.transform="translateY("+t+"px)"}function H(){var t=0,e=document.querySelector(".infinite-scroll"),n=document.createElement("div");n.classList.add("infinite-scroll__item");var r,i=Object.keys(_2.default);e.hasChildNodes()&&(t=(r=parseInt(e.lastChild.getAttribute("data-id"),10))===i.length-1?0:r+1);var a="Untitled_Artwork-"+(t+1).toString();n.innerHTML='<img src="'+_2.default[a].png+'">\n    <div>'+t+"</div>",n.setAttribute("data-id",t),e.appendChild(n)}}function throttledEvent(e,n){var r;return function(t){r||(e(t),r=setTimeout(function(){r=null},n))}}function map(t,e,n,r,i){return(t-e)*(i-r)/(n-e)+r}initApp();