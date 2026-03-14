package com.movie.demo.service;

import com.movie.demo.model.Credits;
import com.movie.demo.model.Genre;
import com.movie.demo.model.GenreResponse;
import com.movie.demo.model.MovieDetails;
import com.movie.demo.model.MovieMap;
import com.movie.demo.model.MovieResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;

@Service
public class MovieService {
    @Value("${tmdb.api.key}")
    private String apiKey;

    @Value("${tmdb.base.url}")
    private String baseUrl;

    private final WebClient webClient;

    public MovieService() {
        this.webClient = WebClient.create();
    }

    public List<MovieMap> getTrendingMovies() {
        try {
            MovieResponse response = webClient.get()
                    .uri(baseUrl + "/trending/movie/day?api_key=" + apiKey)
                    .retrieve()
                    .bodyToMono(MovieResponse.class)
                    .block();
            if (response != null) {
                return response.getResults();
            }
            return Collections.emptyList();
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    public List<MovieMap> getTopTrendingMovies() {
        List<MovieMap> movies = getTrendingMovies();
        return movies.stream()
                .limit(5)
                .toList();
    }

    public List<MovieMap> getMoviesByGenre(int genreId) {
        try {
            MovieResponse response = webClient.get()
                    .uri(baseUrl + "/discover/movie?api_key=" + apiKey + "&with_genres=" + genreId)
                    .retrieve()
                    .bodyToMono(MovieResponse.class)
                    .block();

            System.out.println(response);
            if (response != null) {
                return response.getResults();
            }
            return Collections.emptyList();
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    public List<Genre> getGenres() {
        try {
            GenreResponse response = webClient.get()
                    .uri(baseUrl + "/genre/movie/list?api_key=" + apiKey)
                    .retrieve()
                    .bodyToMono(GenreResponse.class)
                    .block();
            if (response != null) {
                return response.getGenres();
            } else {
                return Collections.emptyList();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    public MovieDetails getMovieDetails(int movieId) {
        try {
            MovieDetails movie = webClient.get()
                    .uri(baseUrl + "/movie/" + movieId + "?api_key=" + apiKey)
                    .retrieve()
                    .bodyToMono(MovieDetails.class)
                    .block();

            Credits credits = webClient.get()
                    .uri(baseUrl + "/movie/" + movieId + "/credits?api_key=" + apiKey)
                    .retrieve()
                    .bodyToMono(Credits.class)
                    .block();
            if (movie != null && credits != null) {
                movie.setCredits(credits);
            }
            return movie;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /*
     * public List<MovieMap> searchMovies(String query){
     * try{
     * MovieResponse response = webClient.get()
     * .uri(baseUrl + "/search/movie?api_key=" + apiKey + "&query=" + query)
     * .retrieve()
     * .bodyToMono(MovieResponse.class)
     * .block();
     * if(response != null){
     * return response.getResults();
     * }
     * return Collections.emptyList();
     * }
     * catch(Exception e){
     * e.printStackTrace();
     * return Collections.emptyList();
     * }
     * }
     */

    public List<MovieMap> searchMovies(String query){
    try{

        String url = "https://api.themoviedb.org/3/search/movie?api_key=" 
                     + apiKey + "&query=" + query;

        MovieResponse response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(MovieResponse.class)
                .block();

        if(response != null){
            return response.getResults();
        }

        return Collections.emptyList();

    }
    catch(Exception e){
        e.printStackTrace();
        return Collections.emptyList();
    }
}

}
