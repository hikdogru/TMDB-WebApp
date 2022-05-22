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



let main = document.querySelector(".main");

const getPersonCredits = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL + "person/" + id + "/" + "combined_credits?api_key=" + API_KEY + "&language=en-US"}`);
        let section = document.createElement("section");
        section.style.width = "100%";
        let ol = document.createElement("ol");
        ol.classList.add("people");
        response.data.cast.forEach(c => {

            let releaseDate = c.release_date === undefined ? new Date(c.first_air_date).getFullYear()
                : new Date(c.release_date).getFullYear();
            let title = c.original_title === undefined ? c.original_name : c.original_title;
            let imageSource = c.poster_path === null ? DEFAULT_IMG_SOURCE : (API_IMG_BASE_URL + c.poster_path);
            section.append(ol);            
            main.append(section)
            let html = `<li class="card">
            <div class="img"><img src="${imageSource}"
                    class="credits-img"></div>
            <div class="center">
                <h3>${title}</h3><span>${releaseDate}</span>
            </div>
        </li>`;
            ol.innerHTML += html;
        });


    } catch (err) {
        console.error(err);
    }
}

export {
    getPersonCredits
}