
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


import { getDetail } from "./common.js"

let main = document.querySelector(".main");


const getCredits = async (type, id) => {
    try {
        const response = await axios.get(API_BASE_URL + type + `/${id}/credits?api_key=${API_KEY}&language=en-US`);
        let section = document.createElement("section");
        section.style.width = "100%";
        let ol = document.createElement("ol");
        ol.classList.add("people");
        section.id = "credits";
        response.data.cast.forEach(c => {            
            let title = c.original_title === undefined ? c.original_name : c.original_title;
            let imageSource = c.profile_path === null ? DEFAULT_IMG_SOURCE : (API_IMG_BASE_URL + c.profile_path);
            section.append(ol);
            main.append(section)
            let html = `<li class="card">
            <div class="img"><img src="${imageSource}"
                    class="credits-img"></div>
            <div class="center">
                <h3>${title}</h3><span>${c.character}</span>
            </div>
        </li>`;
            ol.innerHTML += html;
        });
    } catch (err) {
        console.error(err);
    }
}

const getMoviesByGenre = async ({ target: { id, dataType } }) => {
    try {
        main.innerHTML = "";
        const response = await axios.get(`${API_BASE_URL}discover/${dataType}?api_key=${API_KEY}&include_adult=false&with_genres=${id}`)
        response.data.results.forEach(element => {
            let imgSource = element.poster_path == null ? (DEFAULT_IMG_SOURCE) : (API_IMG_BASE_URL + element.poster_path);
            let title = (element.title === undefined ? element.name : element.title);
            if (element.poster_path === undefined) {
                imgSource = element.profile_path == null ? (DEFAULT_IMG_SOURCE) : (API_IMG_BASE_URL + element.profile_path);
            }
            let html = `<div class="card">
            <div class="img"><a class="detail-link" id="${element.id}" name="${element.id}" data-type="${dataType}"><img
                        src="${imgSource}"></a></div>
            <div class="card-info" style="text-align: center;">
                <h3>${title}</h3>
            </div>
        </div>`

            main.innerHTML += html;
        })

        let detailLinks = document.querySelectorAll(".detail-link");
        detailLinks.forEach(element => {

            element.addEventListener("click", getDetail)
        });
    } catch (error) {
        console.log(error);
    }

}

export {
    getMoviesByGenre,
    getCredits
}