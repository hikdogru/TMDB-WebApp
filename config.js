const API_KEY = "ebd943da4f3d062ae4451758267b1ca9";
const API_BASE_URL = "https://api.themoviedb.org/3/";
const API_IMG_BASE_URL = "https://image.tmdb.org/t/p/w500/";
const POPULAR_MOVIE_URL = `${API_BASE_URL}movie/popular?api_key=${API_KEY}&language=en-US`;
const POPULAR_TVSHOW_URL = `${API_BASE_URL}tv/popular?api_key=${API_KEY}&language=en-US`;
const POPULAR_CELEB_URL = `${API_BASE_URL}person/popular?api_key=${API_KEY}&language=en-US`;


export {
    API_KEY,
    API_BASE_URL,
    API_IMG_BASE_URL,
    POPULAR_MOVIE_URL,
    POPULAR_TVSHOW_URL,
    POPULAR_CELEB_URL
};
