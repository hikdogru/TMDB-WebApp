let form = document.getElementById("search-form");
const apiKey = "ebd943da4f3d062ae4451758267b1ca9";
const imgSource = "https://image.tmdb.org/t/p/w500/";
const defaultImgSource = `./assets/images/no-image.png`;
const baseUrl = "https://api.themoviedb.org/3/";
const popularMovieUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US`;
const popularTvShowUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US`;
const popularCelebUrl = `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&language=en-US`;
let input = document.getElementById("search-input");
let navMovie = document.getElementById("movies");
let navTVShow = document.getElementById("tvshows");
let navCeleb = document.getElementById("celebs");
let main = document.querySelector(".main");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    main.innerHTML = "";
    let query = input.value;
    let url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&query=${query}&include_adult=false`
    input.value = "";
    await getData(url);
});

const getMoviesByGenre = async function () {
    try {
        main.innerHTML = "";
        console.log(`https://api.themoviedb.org/3/discover/${this.dataType}?api_key=${apiKey}&include_adult=false&with_genres=${this.id}`);
        const response = await axios.get(`https://api.themoviedb.org/3/discover/${this.dataType}?api_key=${apiKey}&include_adult=false&with_genres=${this.id}`)
        response.data.results.forEach(element => {
            let card = document.createElement("div");
            card.classList.add("card");
            let imgDiv = document.createElement("div");
            let a = document.createElement("a");
            let img = document.createElement("img");
            let name = document.createElement("div");
            let h3 = document.createElement("h3");
            a.classList.add("detail-link");
            a.id = element.id;
            a.name = element.id;
            a.setAttribute("data-type", "movie");
            imgDiv.classList.add("img");
            img.src = element.poster_path == null ? (defaultImgSource) : (imgSource + element.poster_path);
            if (element.poster_path === undefined) {
                img.src = element.profile_path == null ? (defaultImgSource) : (imgSource + element.profile_path);
            }
            name.classList.add("card-info");
            h3.textContent = (element.title === undefined ? element.name : element.title);
            name.style.textAlign = "center";
            main.append(card)
            card.append(imgDiv, name)
            a.append(img);
            imgDiv.append(a)
            name.append(h3)
        })

        let detailLinks = document.querySelectorAll(".detail-link");
        detailLinks.forEach(element => {

            element.addEventListener("click", getDetail)
        });
    } catch (error) {
        console.log(error);
    }

}

const removeGenres = () => {
    let genresDiv = document.querySelector(`div[class*=genres]`);
    console.log(genresDiv);
    if (genresDiv !== null)
        genresDiv.remove();
}

const getGenres = async (type) => {

    removeGenres();
    let genresTypeDiv = document.querySelector(`div[class*=${type}genres]`);
    if (genresTypeDiv === null) {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/genre/${type}/list?api_key=${apiKey}&language=en-US`);
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


const getDetail = async (e) => {
    try {
        main.innerHTML = "";
        let id = e.target.parentNode.id;
        let type = e.target.parentNode.getAttribute("data-type");
        let element = document.querySelector(".detail-link");
        let url = baseUrl + type + "/" + id + "?api_key=" + apiKey;
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
        img.src = response.data.poster_path == null ? (defaultImgSource) : (imgSource + response.data.poster_path);
        if (response.data.poster_path === undefined) {
            img.src = response.data.profile_path == null ? (defaultImgSource) : (imgSource + response.data.profile_path);
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
        document.body.append(pagingDiv);
        for (let i = 1; i <= 10; i++) {
            let pageLink = document.createElement("a");
            pageLink.classList.add("paging-link")
            pageLink.style.marginBottom = "15px";
            pageLink.style.padding = "8px 16px";
            pageLink.style.border = "1px solid #ddd"
            pageLink.innerText = i;
            pageLink.addEventListener("click", function () {
                let activePage = document.querySelector("a.active");
                if(activePage !== null)
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
            a.classList.add("detail-link");
            a.id = element.id;
            a.name = element.id;
            a.setAttribute("data-type", type);
            imgDiv.classList.add("img");
            img.src = element.poster_path == null ? (defaultImgSource) : (imgSource + element.poster_path);
            if (element.poster_path === undefined) {
                img.src = element.profile_path == null ? (defaultImgSource) : (imgSource + element.profile_path);
            }
            name.classList.add("card-info");
            h3.textContent = (element.title === undefined ? element.name : element.title);
            name.style.textAlign = "center";
            main.append(card)
            card.append(imgDiv, name)
            a.append(img);
            imgDiv.append(a)
            name.append(h3)

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

navMovie.addEventListener("click", (e) => callFunction(e, popularMovieUrl, "movie"));
navTVShow.addEventListener("click", (e) => callFunction(e, popularTvShowUrl, "tv"));
navCeleb.addEventListener("click", (e) => callFunction(e, popularCelebUrl, "person"));