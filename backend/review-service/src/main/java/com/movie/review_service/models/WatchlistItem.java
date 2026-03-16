package com.movie.review_service.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "watchlist_items", uniqueConstraints = @UniqueConstraint(columnNames = { "username", "movie_id" }))
public class WatchlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    private String movieTitle;
    private String posterPath;
    private String releaseYear;
    private Double voteAverage;

    @Column(nullable = false)
    private boolean watched = false;

    @Column(updatable = false)
    private LocalDateTime addedAt;

    @PrePersist
    protected void onCreate() {
        this.addedAt = LocalDateTime.now();
    }

    // ── GETTERS ───────────────────────────────────────────────────────────────
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
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

    public String getReleaseYear() {
        return releaseYear;
    }

    public Double getVoteAverage() {
        return voteAverage;
    }

    public boolean isWatched() {
        return watched;
    } // boolean uses "is" not "get"

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    // ── SETTERS ───────────────────────────────────────────────────────────────
    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public void setReleaseYear(String releaseYear) {
        this.releaseYear = releaseYear;
    }

    public void setVoteAverage(Double voteAverage) {
        this.voteAverage = voteAverage;
    }

    public void setWatched(boolean watched) {
        this.watched = watched;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }
}