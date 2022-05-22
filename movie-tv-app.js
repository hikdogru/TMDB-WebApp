import {
    API_BASE_URL,
    API_IMG_BASE_URL,
    API_KEY,
    POPULAR_MOVIE_URL,
    POPULAR_TVSHOW_URL,
    POPULAR_CELEB_URL
}
    from "./config.js";

import { getData, showPagingLinks, showHomeContents } from "./common.js";

import { getMoviesByGenre } from "./movie-component.js";

import {getPersonCredits} from "./person-component.js"


let form = document.getElementById("search-form");
const defaultImgSource = `./assets/images/no-image.png`;
let input = document.getElementById("search-input");
let navMovie = document.getElementById("movies");
let navTVShow = document.getElementById("tvshows");
let navCeleb = document.getElementById("celebs");
let navHome = document.getElementById("home");
let main = document.querySelector(".main");


showHomeContents();
input.setAttribute("autocomplete", "off");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    main.innerHTML = "";
    let query = input.value;
    let url = `${API_BASE_URL}search/multi?api_key=${API_KEY}&language=en-US&query=${query}&include_adult=false`
    input.value = "";
    await getData(url);
});



let callFunction = async (e, url, type) => {

    e.preventDefault();
    main.innerHTML = "";
    let pagingDiv = document.querySelector(".paging-div");
    if (pagingDiv !== null) {

        document.body.removeChild(pagingDiv);
    }
    showPagingLinks(url, type);
    await getData(url, type);
}


navMovie.addEventListener("click", (e) => callFunction(e, POPULAR_MOVIE_URL, "movie"));
navTVShow.addEventListener("click", (e) => callFunction(e, POPULAR_TVSHOW_URL, "tv"));
navCeleb.addEventListener("click", (e) => callFunction(e, POPULAR_CELEB_URL, "person"));
navHome.addEventListener("click", (e) => {
    e.preventDefault();
    showHomeContents();
})


