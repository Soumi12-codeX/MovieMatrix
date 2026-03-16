package com.movie.review_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.movie.review_service.models.WatchlistItem;

import jakarta.transaction.Transactional;

@Repository
public interface WatchlistRepo extends JpaRepository<WatchlistItem, Long> {
    
    List<WatchlistItem> findByUsernameOrderByAddedAtDesc(String username);

    Optional<WatchlistItem> findByUsernameAndMovieId(String username, Long movieId);
    
    boolean existsByUsernameAndMovieId(String username, Long movieId);

    @Modifying
    @Transactional
    @Query("DELETE FROM WatchlistItem w WHERE w.username = :username AND w.movieId = :movieId")
    void deleteByUsernameAndMovieId(
        @Param("username") String username,
        @Param("movieId") Long movieId
    );
}
