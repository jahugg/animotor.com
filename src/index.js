import homeIcon from "./media/home/home-icon.svg";
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
  let app = document.getElementById("app");
  let nav = document.createElement("nav");
  nav.id = "nav";
  app.appendChild(nav);
  let list = document.createElement("ul");
  nav.appendChild(list);

  for (let key in pages) {
    let item = document.createElement("li");
    item.setAttribute("data-page", key);
    let link = document.createElement("a");
    link.href = pages[key].slug;
    if (key === "home") {
      link.innerHTML = '<img src="' + homeIcon + '" alt="' + pages[key].title + '">'
    } else {
      link.innerHTML = pages[key].title;
    }
    item.appendChild(link);
    list.appendChild(item);
    link.addEventListener("click", handlePageLink);
  }
}

function buildPage(stateObj, addToHistory) {

  let pageKey = stateObj.pageKey;

  // check if main exists
  let main = document.getElementById("main");
  if (main) // empty main
    main.innerHTML = "";

  else { // create main
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
  let links = document.querySelectorAll('nav a');
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