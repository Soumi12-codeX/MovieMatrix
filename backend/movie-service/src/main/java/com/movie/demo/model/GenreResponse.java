package com.movie.demo.model;

import java.util.List;

public class GenreResponse {
    private List<Genre> genres;

    public GenreResponse(){}

    public List<Genre> getGenres(){
        return genres;
    }
    public void setGenres(List<Genre> genres){
        this.genres = genres;
    }
}
