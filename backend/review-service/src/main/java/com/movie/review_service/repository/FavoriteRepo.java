package com.movie.review_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.movie.review_service.models.FavoriteItem;

import jakarta.transaction.Transactional;

@Repository
public interface FavoriteRepo extends JpaRepository<FavoriteItem, Long> {
    
    List<FavoriteItem> findByUsernameOrderByAddedAtDesc(String username);

    Optional<FavoriteItem> findByUsernameAndMovieId(String username, Long movieId);

    boolean existsByUsernameAndMovieId(String username, Long movieId);

    @Modifying
    @Transactional
    @Query("DELETE FROM FavoriteItem f WHERE f.username = :username AND f.movieId = :movieId")
    void deleteByUsernameAndMovieId(
        @Param("username") String username,
        @Param("movieId") Long movieId
    );
    
}
