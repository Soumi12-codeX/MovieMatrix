package com.movie.review_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.movie.review_service.models.Review;

@Repository
public interface ReviewRepo extends JpaRepository<Review, Long>
{
    List<Review> findByUsername(String username);

    List<Review> findByMovieIdOrderByCreatedAtDesc(Long movieId);

    Optional<Review> findByUsernameAndMovieId(String username, Long movieId);

    boolean existsByUsernameAndMovieId(String username, Long movieId);
}
