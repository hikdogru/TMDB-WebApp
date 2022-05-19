import {
    API_BASE_URL,
    API_IMG_BASE_URL,
    API_KEY,
    POPULAR_MOVIE_URL,
    POPULAR_TVSHOW_URL,
    POPULAR_CELEB_URL
}
    from "./config.js";

import { getMoviesByGenre } from "./movie-component.js";
let form = document.getElementById("search-form");
const defaultImgSource = `./assets/images/no-image.png`;
let input = document.getElementById("search-input");
let navMovie = document.getElementById("movies");
let navTVShow = document.getElementById("tvshows");
let navCeleb = document.getElementById("celebs");
let navHome = document.getElementById("home");
let main = document.querySelector(".main");



input.setAttribute("autocomplete", "off");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    main.innerHTML = "";
    let query = input.value;
    let url = `${API_BASE_URL}search/multi?api_key=${API_KEY}&language=en-US&query=${query}&include_adult=false`
    input.value = "";
    await getData(url);
});


// getmoviesbygenre



const removeGenres = () => {
    let genresDiv = document.querySelector(`div[class*=genres]`);
    if (genresDiv !== null)
        genresDiv.remove();
}

const getGenres = async (type) => {

    removeGenres();
    let genresTypeDiv = document.querySelector(`div[class*=${type}genres]`);
    if (genresTypeDiv === null) {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/genre/${type}/list?api_key=${API_KEY}&language=en-US`);
            let div = document.createElement("div");
            let searchDiv = document.querySelector("div.search");
            searchDiv.parentNode.insertBefore(div, searchDiv.nextSibling);
            response.data.genres.forEach(element => {
                let button = document.createElement("button");
                button.textContent = element.name;
                button.id = element.id;
                button.dataType = type;
                button.classList.add("btn-genres");
                div.append(button);
            })
            div.classList.add(`${type}genres`);
            let btnGenres = document.querySelectorAll(".btn-genres");
            btnGenres.forEach(btn => {
                btn.addEventListener("click", getMoviesByGenre);
            })

        } catch (error) {
            console.log(error);
        }
    }

}

const getCredits = async (type, id) => {
    try {
        const response = await axios.get(API_BASE_URL + type + `/${id}/credits?api_key=${API_KEY}&language=en-US`);
        let cast = document.createElement("div");
        cast.classList.add("cast");

        response.data.cast.forEach(c => {
            let card = document.createElement("div");
            card.classList.add("card");
            let imgDiv = document.createElement("div");

            let img = document.createElement("img");
            let name = document.createElement("div");
            let h3 = document.createElement("h3");
            h3.textContent = c.original_name;
            img.src = c.profile_path === null ? defaultImgSource : (API_IMG_BASE_URL + c.profile_path);
            imgDiv.classList.add("img");
            name.classList.add("center");
            imgDiv.append(img);
            main.append(card)
            card.append(imgDiv, name)

            name.append(h3);

        });





    } catch (err) {
        console.error(err);
    }
}

const getPersonCredits = async (id) => {


    try {
        const response = await axios.get(`${API_BASE_URL + "person/" + id + "/" + "combined_credits?api_key=" + API_KEY + "&language=en-US"}`);
        let section = document.createElement("section");
        section.style.width = "100%";
        let ol = document.createElement("ol");
        ol.classList.add("people");
        response.data.cast.forEach(c => {

            let card = document.createElement("li");
            card.classList.add("card");
            let imgDiv = document.createElement("div");
            let img = document.createElement("img");
            let name = document.createElement("div");
            let h3 = document.createElement("h3");
            let releaseDate = document.createElement("span");
            releaseDate.textContent = c.release_date === undefined ? new Date(c.first_air_date).getFullYear()
                : new Date(c.release_date).getFullYear();
            h3.textContent = c.original_title === undefined ? c.original_name : c.original_title;
            img.src = c.poster_path === null ? defaultImgSource : (API_IMG_BASE_URL + c.poster_path);
            imgDiv.classList.add("img");
            img.classList.add("credits-img");
            name.classList.add("center");
            imgDiv.append(img);
            section.append(ol);
            ol.append(card);
            main.append(section)
            card.append(imgDiv, name)
            name.append(h3, releaseDate);
        });





    } catch (err) {
        console.error(err);
    }
}

const hidePagingLinks = () => {
    let pagingDiv = document.querySelector(".paging-div");
    if (pagingDiv !== null)
        pagingDiv.style.display = "none";

}

const getDetail = async (e) => {
    try {
        hidePagingLinks();
        main.innerHTML = "";
        let id = e.target.parentNode.id;
        let type = e.target.parentNode.getAttribute("data-type");
        let element = document.querySelector(".detail-link");
        let url = API_BASE_URL + type + "/" + id + "?api_key=" + API_KEY;
        let response = await axios.get(url);
        let card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("card-flex");
        let imgDiv = document.createElement("div");
        let a = document.createElement("a");
        let img = document.createElement("img");
        let name = document.createElement("div");
        let h3 = document.createElement("h3");
        let overviewElement = document.createElement("p");
        let popularityElement = document.createElement("p");
        card.style.width = "80%";
        h3.style.margin = "1rem";
        imgDiv.classList.add("img");
        img.src = response.data.poster_path == null ? (defaultImgSource) : (API_IMG_BASE_URL + response.data.poster_path);
        if (response.data.poster_path === undefined) {
            img.src = response.data.profile_path == null ? (defaultImgSource) : (API_IMG_BASE_URL + response.data.profile_path);
        }
        name.classList.add("card-info");
        h3.textContent = "Name :" + (response.data.title === undefined ? response.data.name : response.data.title);
        overviewElement.textContent = "Overview :" + (response.data.overview === undefined ? response.data.biography : response.data.overview);
        popularityElement.textContent = "Popularity :" + response.data.popularity;
        console.log(response.data);
        name.style.textAlign = "center";
        main.append(card)
        card.append(imgDiv, name)
        a.append(img);
        imgDiv.append(a)
        name.append(h3, overviewElement, popularityElement)

        if (type !== "person")
            getCredits(type, id);
        else
            getPersonCredits(id);


    } catch (error) {
        console.log(error);


    }
};


const showPagingLinks = function (url, type) {


    let isPagingDivExists = document.querySelector(".paging-div");
    if (isPagingDivExists === null) {
        let pagingDiv = document.createElement("div");
        pagingDiv.classList.add("center", "paging-div");
        pagingDiv.style.marginBottom = "1rem";
        pagingDiv.style.marginTop = "2rem";
        document.body.append(pagingDiv);
        for (let i = 1; i <= 10; i++) {
            let pageLink = document.createElement("a");
            pageLink.style.padding = "8px 16px";
            pageLink.style.border = "1px solid #ddd"
            pageLink.innerText = i;
            pageLink.addEventListener("click", function () {
                let activePage = document.querySelector("a.active");
                if (activePage !== null)
                    activePage.classList.remove("active");
                pageLink.classList.add("active");
                let requestUrl = url + `&page=${i}`;
                getData(requestUrl, type);
            })
            pageLink.setAttribute("data-type", type)
            pagingDiv.append(pageLink);
        }
    }


};

const getData = async (url, type) => {
    try {
        main.innerHTML = "";
        if (type !== "person")
            getGenres(type);
        else
            removeGenres();


        const response = await axios.get(url);
        response.data.results.forEach(element => {
            let card = document.createElement("div");
            card.classList.add("card");
            let imgDiv = document.createElement("div");
            let a = document.createElement("a");
            let img = document.createElement("img");
            let name = document.createElement("div");
            let h3 = document.createElement("h3");
            let releaseDate = document.createElement("span");
            a.classList.add("detail-link");
            a.id = element.id;
            a.name = element.id;
            a.setAttribute("data-type", (type === undefined ? element.media_type : type));
            imgDiv.classList.add("img");
            img.src = element.poster_path == null ? (defaultImgSource) : (API_IMG_BASE_URL + element.poster_path);
            if (element.poster_path === undefined) {
                img.src = element.profile_path == null ? (defaultImgSource) : (API_IMG_BASE_URL + element.profile_path);
            }
            name.classList.add("card-info");
            h3.textContent = (element.title === undefined ? element.name : element.title);
            name.style.textAlign = "center";
            main.append(card)
            card.append(imgDiv, name)
            a.append(img);
            imgDiv.append(a)
            name.append(h3);
            releaseDate.textContent = element.release_date === undefined ? new Date(element.first_air_date).toLocaleDateString()
                : new Date(element.release_date).toLocaleDateString();
            name.append(releaseDate);
        })

        let detailLinks = document.querySelectorAll(".detail-link");
        detailLinks.forEach(element => {
            element.addEventListener("click", getDetail)
        });

    }

    catch (error) {
        console.log(error);
    }
};

const showHomeContents = async () => {
    removeGenres();
    hidePagingLinks();
    main.innerHTML = "";
    let container = document.createElement("div");
    container.classList.add("search-container");
    let searchingDiv = document.createElement("div");
    let titleDiv = document.createElement("div");
    titleDiv.classList.add("title-div");
    searchingDiv.classList.add("search-div");
    let searchInput = document.createElement("input");
    let searchButton = document.createElement("button");
    searchButton.textContent = "Search";
    searchButton.classList.add("search-button");
    searchInput.classList.add("search-input")
    titleDiv.textContent = "Millions of movies, TV shows and people to discover. Explore now.";
    titleDiv.style.margin = "1rem";
    container.style.border = "1px solid orange";
    main.append(container);
    searchingDiv.append(searchInput, searchButton);
    container.append(titleDiv, searchingDiv);
}

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


