"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.render=render;var _=_interopRequireDefault(require("./../media/projects/*/*.*"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function render(){var e=document.getElementById("main"),f=document.createElement("div");f.classList.add("slideshow-container"),e.appendChild(f);function t(e){var t=1<Object.keys(_.default[e]).length,d=document.createElement("div");d.classList.add("slideshow"),d.id=e,f.appendChild(d);var r=document.createElement("div");r.classList.add("slideshow__slides-wrapper"),d.appendChild(r);var i=void 0;r.addEventListener("scroll",function(t){window.clearTimeout(i),i=setTimeout(function(){var e=Math.round(t.target.scrollLeft/t.target.offsetWidth);!function(e){var t=e.parentNode,d=!0,r=!1,i=void 0;try{for(var s,a=t.children[Symbol.iterator]();!(d=(s=a.next()).done);d=!0){s.value.removeAttribute("data-active")}}catch(e){r=!0,i=e}finally{try{d||null==a.return||a.return()}finally{if(r)throw i}}e.setAttribute("data-active","")}(t.target.closest(".slideshow").querySelector(".slideshow__indicators-wrapper").children[e])},10)},!1);var s,a,o,l=void 0;for(var n in t&&(d.addEventListener("mouseover",function(e){d.querySelector(".slideshow__indicators-wrapper").setAttribute("data-active","")},!0),d.addEventListener("mouseout",function(e){console.log("mouse over"),d.querySelector(".slideshow__indicators-wrapper").removeAttribute("data-active")},!0),(s=document.createElement("div")).classList.add("slideshow__nav"),d.appendChild(s),(a=document.createElement("button")).classList.add("slideshow__nav__btn"),s.appendChild(a),a.addEventListener("click",w),(o=document.createElement("button")).classList.add("slideshow__nav__btn"),s.appendChild(o),o.addEventListener("click",L),(l=document.createElement("div")).classList.add("slideshow__indicators-wrapper"),d.appendChild(l)),_.default[e])for(var c in _.default[e][n]){var u,v,h=_.default[e][n][c],p=document.createElement("div");p.classList.add("slideshow__slide"),r.appendChild(p),"jpg"!==c&&"png"!==c&&"gif"!==c||((u=document.createElement("img")).src=h,u.classList.add("slideshow__slide__media"),p.appendChild(u)),t&&((v=document.createElement("div")).classList.add("slideshow__indicator"),v.addEventListener("click",m),l.appendChild(v))}t&&l.querySelector(".slideshow__indicator").setAttribute("data-active","")}for(var d in _.default)t(d);function m(e){var t=e.target,d=t.closest(".slideshow__indicators-wrapper"),r=t.closest(".slideshow"),i=r.querySelector(".slideshow__slides-wrapper"),s=Array.from(d.children).indexOf(t);i.scrollTo({left:s*r.offsetWidth,behavior:"smooth"})}function w(e){var t=e.target.closest(".slideshow__slides-wrapper");t.scrollTo({left:t.scrollLeft-t.offsetWidth,behavior:"smooth"})}function L(e){var t=e.target.closest(".slideshow__slides-wrapper");t.scrollTo({left:t.scrollLeft+t.offsetWidth,behavior:"smooth"})}}