import homeIcon from "./media/home/home-icon.svg";
import * as helpers from "./modules/helpers.js";

const defaultPage = "home";
const pages = {
  home: {
    title: "Home",
    slug: "/",
    module: import('./modules/home.js')
  },
  work: {
    title: "Work",
    slug: "/work",
    module: import('./modules/work.js')
  },
  info: {
    title: "Info",
    slug: "/info",
    module: import('./modules/info.js')
  }
};

function initApp() {
  buildNavigation();
  navigateToCurrentURL();

  // handle history pop state events
  window.addEventListener('popstate', (event) => {
    let slug = event.state.slug;
    let pageKey;
    for (let key in pages)
      if (pages[key].slug === slug)
        pageKey = key;


    let stateObj = { pageKey: pageKey };

    buildPage(stateObj, false);
  });
}

function navigateToCurrentURL() {

  // read slug from url
  let urlPath = window.location.pathname;

  // check slug for validity
  let pageKey = defaultPage;
  for (let key in pages)
    if (pages[key].slug === urlPath)
      pageKey = key;

  // create state object
  let stateObj = { pageKey: pageKey };

  // build page
  buildPage(stateObj, true);
}

function buildNavigation() {
  let header = document.createElement("header");
  header.classList.add("header--relative")
  let nav = document.createElement("nav");
  nav.classList.add("main-nav");
  header.appendChild(nav);
  let list = document.createElement("ul");
  list.classList.add("main-nav__list");
  nav.appendChild(list);

  for (let key in pages) {
    let item = document.createElement("li");
    item.setAttribute("data-page", key);
    list.appendChild(item);

    let link = document.createElement("a");
    link.href = pages[key].slug;
    link.addEventListener("click", handlePageLink);
    item.appendChild(link);

    if (key === "home")
      link.innerHTML = '<img src="' + homeIcon + '" alt="' + pages[key].title + '">'
    else
      link.innerHTML = pages[key].title;
  }

  // add to DOM
  let app = document.getElementById("app");
  app.appendChild(header);

  // add navigation scroll behaviour
  let lastScrollTop = 0;
  window.addEventListener('scroll', helpers.throttledEvent(handleScroll, 20))

  function handleScroll(event) {
    let threshold = 200;
    let scrollTop = event.target.scrollingElement.scrollTop;
    let header = document.querySelector("header");

    // don't start handling before threshold
    if (scrollTop > threshold) {

      // hide navigation on scroll down
      if (scrollTop > lastScrollTop &&
        header.classList.contains("header--fixed-open")) {
        header.classList.replace("header--fixed-open", "header--relative");
        document.querySelector("main").style.paddingTop = 0;

        // show navigation on scroll up
      } else if (scrollTop < lastScrollTop) {
        header.classList.replace("header--relative", "header--fixed-open");
        document.querySelector("main").style.paddingTop = header.offsetHeight + "px";
      }
    
    // hide if top reached
    } else if (scrollTop <= 5) {
      header.classList.replace("header--fixed-open", "header--relative")
      document.querySelector("main").style.paddingTop = 0;
    }

    // save scroll position for comparison
    lastScrollTop = scrollTop;
  }
}

function buildPage(stateObj, addToHistory) {

  let pageKey = stateObj.pageKey;

  // check if main exists
  let main = document.getElementById("main");
  if (main) {
    // reset stuff
    main.innerHTML = "";

    let header = document.querySelector('header');
    header.classList.remove("header--fixed", "header--fixed-bg");
    header.classList.add("header--relative");

  } else { // create main
    main = document.createElement("main");
    main.id = "main";
    app.appendChild(main);
  }

  let page = pages[pageKey];

  // set page title
  let title = "Animotor";
  if (stateObj.page !== defaultPage) title += " - " + page.title;
  document.title = title;

  // push page into browser history
  if (addToHistory)
    window.history.pushState(stateObj, page.title, page.slug);

  // update navigation
  updateNavigation(page.slug);

  // load page module
  pages[pageKey].module.then(module => {
    module.render();
  }).catch(err => {
    console.log(err.message);
  });
}

function updateNavigation(currentSlug) {
  // handle navigation items
  let links = document.querySelectorAll('.main-nav a');
  for (let link of links)
    link.removeAttribute("data-active");

  // set link for current page as active
  document.querySelector('a[href="' + currentSlug + '"]').setAttribute("data-active", "");
}

function handlePageLink(event) {
  event.preventDefault();
  let target = event.target.closest("a");
  let pageKey;
  for (let key in pages)
    if (pages[key].slug === target.getAttribute("href"))
      pageKey = key;

  let stateObj = { pageKey: pageKey }; // create state object
  buildPage(stateObj, true);
}

initApp();