package com.movie.review_service.dto;
public class ReviewRequest {

    private Long movieId;
    private String movieTitle;
    private String posterPath;
    private Integer rating;
    private String content;

    
    public ReviewRequest() {
    }

    public ReviewRequest(Long movieId, String movieTitle, String posterPath,
            Integer rating, String content) {
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.posterPath = posterPath;
        this.rating = rating;
        this.content = content;
    }

    public Long getMovieId() {
        return movieId;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public String getPosterPath() {
        return posterPath;
    }

    public Integer getRating() {
        return rating;
    }

    public String getContent() {
        return content;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public void setContent(String content) {
        this.content = content;
    }
}