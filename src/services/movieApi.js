import axios from "axios";

const BASE_URL = "http://localhost:8082/movies";

export const getTop5Movies = () => {
    return axios.get(`${BASE_URL}/trending/top5`);
}

export const getTrendingMovies = () =>{
    return axios.get(`${BASE_URL}/trending`);
}

export const getMoviesByGenre = (genreId) => {
    return axios.get(`${BASE_URL}/genre/${genreId}`);
}

export const getGenres = () =>{
    return axios.get(`${BASE_URL}/genres`);
}

export const searchMovies = (query) =>{
    return axios.get(`${BASE_URL}/search?query=${query}`);
}