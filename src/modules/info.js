import contentInfo from "./../media/info/article.md";

export function render() {

    let main = document.getElementById("main");
    main.innerHTML = `<article class="info">` + contentInfo + `</article>`;
}