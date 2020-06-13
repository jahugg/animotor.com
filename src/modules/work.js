import projects from "./../media/projects/*/*.*";

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
        slideshow.id = projectName;
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

            // fade in indicators animation
            slideshow.addEventListener("mouseover", function (event) {
                slideshow.querySelector(".slideshow__indicators-wrapper").setAttribute("data-active", "");
            }, true);
            slideshow.addEventListener("mouseout", function (event) {
                console.log("mouse over");
                slideshow.querySelector(".slideshow__indicators-wrapper").removeAttribute("data-active");
            }, true);

            // create navigation items
            let navigation = document.createElement("div");
            navigation.classList.add("slideshow__nav");
            slideshow.appendChild(navigation);

            let prevButton = document.createElement("button");
            prevButton.classList.add("slideshow__nav__btn");
            navigation.appendChild(prevButton);
            prevButton.addEventListener("click", previousSlide);

            let nextButton = document.createElement("button");
            nextButton.classList.add("slideshow__nav__btn");
            navigation.appendChild(nextButton);
            nextButton.addEventListener("click", nextSlide);

            // create indicators wrapper
            indicatorsWrapper = document.createElement("div");
            indicatorsWrapper.classList.add("slideshow__indicators-wrapper");
            slideshow.appendChild(indicatorsWrapper);
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

    function previousSlide(event) {
        let slideshow = event.target.closest(".slideshow__slides-wrapper");
        slideshow.scrollTo({
            left: slideshow.scrollLeft - slideshow.offsetWidth,
            behavior: 'smooth'
        });
    }

    function nextSlide(event) {
        let slideshow = event.target.closest(".slideshow__slides-wrapper");
        slideshow.scrollTo({
            left: slideshow.scrollLeft + slideshow.offsetWidth,
            behavior: 'smooth'
        });
    }
}