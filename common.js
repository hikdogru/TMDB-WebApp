import {
    API_BASE_URL,
    API_IMG_BASE_URL,
    API_KEY,
    POPULAR_MOVIE_URL,
    POPULAR_TVSHOW_URL,
    POPULAR_CELEB_URL,
    DEFAULT_IMG_SOURCE
}
    from "./config.js";


import { getPersonCredits } from "./person-component.js";
import {getMoviesByGenre, getCredits} from "./movie-component.js"

let main = document.querySelector(".main");


const removeGenres = () => {
    let genresDiv = document.querySelector(`div[class*=genres]`);
    if (genresDiv !== null)
        genresDiv.remove();
}

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
        let url = API_BASE_URL + type + "/" + id + "?api_key=" + API_KEY;
        let response = await axios.get(url);
        let imageSource = response.data.poster_path == null ? (DEFAULT_IMG_SOURCE) : (API_IMG_BASE_URL + response.data.poster_path);
        if (response.data.poster_path === undefined) {
            imageSource = response.data.profile_path == null ? (DEFAULT_IMG_SOURCE) : (API_IMG_BASE_URL + response.data.profile_path);
        }
        let name = (response.data.title === undefined ? response.data.name : response.data.title);
        let overview = (response.data.overview === undefined ? response.data.biography : response.data.overview);
        let popularity = response.data.popularity;
        let html = ` <div class="card card-flex" style="width: 80%;">
        <div class="img"><a><img src="${imageSource}"></a></div>
        <div class="card-info" style="text-align: center;">
            <h3 style="margin: 1rem;">Name :${name}</h3>
            <p>Overview : ${overview}
            </p>
            <p>Popularity : ${popularity} </p>
        </div>
        </div>`
        main.innerHTML = html;

        if (type !== "person")
            getCredits(type, id);
        else
            getPersonCredits(id);


    } catch (error) {
        console.log(error);
    }
};

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

const getData = async (url, type) => {
    try {
        main.innerHTML = "";
        if (type !== "person")
            getGenres(type);
        else
            removeGenres();
        const response = await axios.get(url);
        response.data.results.forEach(element => {
            let id = element.id;
            let mediaType = type === undefined ? element.media_type : type;
            let imageSource = element.poster_path == null ? (DEFAULT_IMG_SOURCE) : (API_IMG_BASE_URL + element.poster_path);
            if (element.poster_path === undefined) {
                imageSource = element.profile_path == null ? (DEFAULT_IMG_SOURCE) : (API_IMG_BASE_URL + element.profile_path);
            }
            let title = (element.title === undefined ? element.name : element.title);
            let releaseDate = element.release_date === undefined ? new Date(element.first_air_date).toLocaleDateString()
                : new Date(element.release_date).toLocaleDateString();
            let html = `<div class="card">
            <div class="img"><a class="detail-link" id="${id}" name="${id}" data-type="${mediaType}"><img
                        src="${imageSource}"></a></div>
            <div class="card-info" style="text-align: center;">
                <h3>${title}</h3><span>${releaseDate}</span>
            </div>
        </div>`;

            main.innerHTML += html;
        });

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

export {
    getData,
    showPagingLinks,
    getDetail,
    showHomeContents
}


