import contentInfo from "./../media/content-info.md";

export function render() {
    console.log("info page");

    let main = document.getElementById("main");
    main.innerHTML = `<article class="info">` + contentInfo + `</article>`;
}