package com.movie.demo.model;

import java.util.List;

public class MovieResponse {
    private List<MovieMap> results;

    public List<MovieMap> getResults(){
        return results;
    }
    public void setResults(List<MovieMap> results){
        this.results = results;
    }
}
