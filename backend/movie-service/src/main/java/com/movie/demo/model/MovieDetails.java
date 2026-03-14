package com.movie.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MovieDetails {
    private int id;
    private String title;
    private String overview;
    
    @JsonProperty("poster_path")
    private String posterPath;

    @JsonProperty("backdrop_path")
    private String backdropPath;

    @JsonProperty("release_date")
    private String releaseDate;

    @JsonProperty("vote_average")
    private double voteAverage;

    private Credits credits;

    public MovieDetails() {
    }

    public int getId() {
        return id;
    }   
    public void setId(int id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getOverview() {
        return overview;
    }
    public void setOverview(String overview) {
        this.overview = overview;
    }
    public String getPosterPath() {
        return posterPath;
    }
    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }
    public String getBackdropPath() {
        return backdropPath;
    }
    public void setBackdropPath(String backdropPath) {
        this.backdropPath = backdropPath;
    }
    public String getReleaseDate() {
        return releaseDate;
    }
    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }
    public double getVoteAverage() {
        return voteAverage;
    }
    public void setVoteAverage(double voteAverage) {
        this.voteAverage = voteAverage;
    }
    public Credits getCredits() {
        return credits;
    }
    public void setCredits(Credits credits) {
        this.credits = credits;
    }
}
