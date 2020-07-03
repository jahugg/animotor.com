import projects from "./../media/work/*/*.*";
import * as helpers from "./helpers.js";

export function render() {
    let main = document.getElementById("main");
    let container = document.createElement("div");
    container.classList.add("slideshow-container");
    main.appendChild(container);

    // iterate over projects
    for (let projectName in projects) {

        // check if multiple images
        let multipleImages = (Object.keys(projects[projectName]).length > 1) ? true : false;

        // create slideshow
        let slideshow = document.createElement("div");
        slideshow.classList.add("slideshow");
        slideshow.id = helpers.sanitizeString(projectName);
        container.appendChild(slideshow);

        let slidesWrapper = document.createElement("div");
        slidesWrapper.classList.add("slideshow__slides-wrapper");
        slideshow.appendChild(slidesWrapper);

        // add event to handle end of scrolling
        let isScrolling;
        slidesWrapper.addEventListener("scroll", function (event) {

            // Clear our timeout throughout the scroll
            window.clearTimeout(isScrolling);

            // Set a timeout to run after scrolling ends
            isScrolling = setTimeout(function () {

                // Run the callback
                let index = Math.round(event.target.scrollLeft / event.target.offsetWidth);
                let slideshow = event.target.closest(".slideshow");
                let indicator = slideshow.querySelector(".slideshow__indicators-wrapper").children[index];
                updateIndicators(indicator);
            }, 10);
        }, false);

        let indicatorsWrapper;
        if (multipleImages) {
            slideshow.classList.add("multiple");

            // create indicators wrapper
            indicatorsWrapper = document.createElement("div");
            indicatorsWrapper.classList.add("slideshow__indicators-wrapper");
            slideshow.appendChild(indicatorsWrapper);

            // add slideshow listeners
            slideshow.addEventListener("click", nextSlide);
            slideshow.addEventListener("mouseover", () => indicatorsWrapper.setAttribute("data-active", ""));
            slideshow.addEventListener("mouseout", () => indicatorsWrapper.removeAttribute("data-active"));
        }


        // iterate over project files
        for (let fileName in projects[projectName]) {
            for (let fileType in projects[projectName][fileName]) {
                let filepath = projects[projectName][fileName][fileType];
                let mediaContainer = document.createElement("div");
                mediaContainer.classList.add("slideshow__slide");
                slidesWrapper.appendChild(mediaContainer);

                // add media item
                if (fileType === "jpg"
                    || fileType === "png"
                    || fileType === "gif") {
                    let media = document.createElement("img");
                    media.src = filepath;
                    media.classList.add("slideshow__slide__media");
                    mediaContainer.appendChild(media);
                }

                // add indicator
                if (multipleImages) {
                    let indicatorItem = document.createElement("div");
                    indicatorItem.classList.add("slideshow__indicator");
                    indicatorItem.addEventListener("click", jumpToSlide);
                    indicatorsWrapper.appendChild(indicatorItem);
                }
            }
        }

        // set first indicator active
        if (multipleImages)
            indicatorsWrapper.querySelector(".slideshow__indicator").setAttribute("data-active", "");
    }

    function jumpToSlide(event) {
        event.stopPropagation();
        console.log("hit");

        let target = event.target;
        let parent = target.closest(".slideshow__indicators-wrapper");
        let slideshow = target.closest(".slideshow");
        let slidesWrapper = slideshow.querySelector(".slideshow__slides-wrapper");

        // get index of child
        let targetIndex = Array.from(parent.children).indexOf(target);
        slidesWrapper.scrollTo({
            left: targetIndex * slideshow.offsetWidth,
            behavior: 'smooth'
        });
    };

    function updateIndicators(indicator) {
        let indicatorsWrapper = indicator.parentNode;

        // remove active attribute
        for (let indicator of indicatorsWrapper.children)
            indicator.removeAttribute("data-active");

        // indicatorsWrapper.children[index].setAttribute("data-active", "");
        indicator.setAttribute("data-active", "");
    }

    function nextSlide(event) {
        let slideshow = event.target.closest(".slideshow").querySelector(".slideshow__slides-wrapper");
        // scroll to next slide
        if (slideshow.scrollLeft < slideshow.scrollWidth - slideshow.offsetWidth)
            slideshow.scrollTo({
                left: slideshow.scrollLeft + slideshow.offsetWidth,
                behavior: 'smooth'
            });

        // scroll to start
        else
            slideshow.scrollTo(0, 0);
    }
}