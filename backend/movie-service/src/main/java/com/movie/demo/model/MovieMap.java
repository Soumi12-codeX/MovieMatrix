package com.movie.demo.model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

public class MovieMap {

    private int id;
    private String title;
    private String overview;

    @JsonProperty("poster_path")
    private String posterPath;

    @JsonProperty("backdrop_path")
    private String backdropPath;

    @JsonProperty("release_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate releaseDate;

    @JsonProperty("vote_average")
    private double voteAverage;

    @JsonProperty("genre_ids")
    private List<Integer> genreIds;

    public MovieMap(){}

    public int getId(){ return id; }
    public void setId(int id){ this.id = id; }

    public String getTitle(){ return title; }
    public void setTitle(String title){ this.title = title; }

    public String getOverview(){ return overview; }
    public void setOverview(String overview){ this.overview = overview; }

    public String getPosterPath(){ return posterPath; }
    public void setPosterPath(String posterPath){ this.posterPath = posterPath; }

    public String getBackdropPath(){ return backdropPath; }
    public void setBackdropPath(String backdropPath){ this.backdropPath = backdropPath; }

    public LocalDate getReleaseDate(){ return releaseDate; }
    public void setReleaseDate(LocalDate releaseDate){ this.releaseDate = releaseDate; }

    public double getVoteAverage(){ return voteAverage; }
    public void setVoteAverage(double voteAverage){ this.voteAverage = voteAverage; }

    public List<Integer> getGenreIds(){ return genreIds; }
    public void setGenreIds(List<Integer> genreIds){ this.genreIds = genreIds; }
}