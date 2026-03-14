package com.movie.demo.controller;

import java.util.List;
import com.movie.demo.model.Genre;
import com.movie.demo.model.MovieDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.movie.demo.model.MovieMap;
import com.movie.demo.service.MovieService;

@RestController
@RequestMapping("/movies")
@CrossOrigin
public class MovieController {
    
    @Autowired
    private MovieService movieService;

    public MovieController(MovieService movieService){
        this.movieService = movieService;
    }

    @GetMapping("/trending/top5")
    public List<MovieMap> getTopTrendingMovies() {
        return movieService.getTopTrendingMovies();
    }

    @GetMapping("/trending")
    public List<MovieMap> getTrendingMovies() {
        return movieService.getTrendingMovies();
    }

    @GetMapping("/genre/{genreId}")
    public List<MovieMap> getMoviesByGenre(@PathVariable int genreId){
        return movieService.getMoviesByGenre(genreId);
    }

    @GetMapping("/genres")
    public List<Genre> getGenres(){
        return movieService.getGenres();
    }

    @GetMapping("/{id}")
    public MovieDetails getMovieDetails(@PathVariable int id){
        return movieService.getMovieDetails(id);
    }
    @GetMapping("/search")
    public List<MovieMap> searchMovies(@RequestParam String query){
        return movieService.searchMovies(query);
    }
}
