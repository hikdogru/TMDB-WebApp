
import {
    API_BASE_URL,
    API_IMG_BASE_URL,
    API_KEY,
    POPULAR_MOVIE_URL,
    POPULAR_TVSHOW_URL,
    POPULAR_CELEB_URL
}
    from "./config.js";


const getMoviesByGenre = async ({ target: { id, dataType } }) => {
    try {

        let main = document.querySelector(".main");
        main.innerHTML = "";
        const response = await axios.get(`${API_BASE_URL}discover/${dataType}?api_key=${API_KEY}&include_adult=false&with_genres=${id}`)
        response.data.results.forEach(element => {
            let imgSource = element.poster_path == null ? (defaultImgSource) : (API_IMG_BASE_URL + element.poster_path);
            let title = (element.title === undefined ? element.name : element.title);
            if (element.poster_path === undefined) {
                imgSource = element.profile_path == null ? (defaultImgSource) : (API_IMG_BASE_URL + element.profile_path);
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
    getMoviesByGenre
}