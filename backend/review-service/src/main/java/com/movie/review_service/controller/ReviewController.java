package com.movie.review_service.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.movie.review_service.dto.ReviewRequest;
import com.movie.review_service.models.FavoriteItem;
import com.movie.review_service.models.Review;
import com.movie.review_service.models.WatchlistItem;
import com.movie.review_service.service.ReviewService;

@RestController
@RequestMapping("/review")
@CrossOrigin
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext()
                                    .getAuthentication()    
                                    .getName();
    }

    //post or update reviews
    @PostMapping("/reviews")
    public ResponseEntity<Review> saveReview(@RequestBody ReviewRequest request){
        String username = getCurrentUsername();
        Review saved = reviewService.saveReview(username, request);
        return ResponseEntity.ok(saved);
    }

    //get all reviews of user
    @GetMapping("/reviews/my")
    public ResponseEntity<List<Review>> getMyReviews() {
        String username = getCurrentUsername();
        return ResponseEntity.ok(reviewService.getUserReviews(username));
    }

    //get reviews for a movie
    @GetMapping("reviews/movie/{movieId}")
    public ResponseEntity<List<Review>> getMovieReviews(@PathVariable Long movieId){

        return ResponseEntity.ok(reviewService.getMovieReviews(movieId));
    }

    //get current user review for a movie
    @GetMapping("/reviews/movie/{movieId}/mine")
    public ResponseEntity<?> getMyReviewForMovie(@PathVariable Long movieId){
        String username = getCurrentUsername();
        return reviewService.getUserReviewForMovie(username, movieId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    //delete review
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId){
        String username = getCurrentUsername();
        boolean deleted = reviewService.deleteReview(username, reviewId);

        if(deleted){
            return ResponseEntity.ok(Map.of("message", "Review deleted"));
        }
        return ResponseEntity.status(403).body(Map.of("message", "Not authorized or not found"));
    }

    //add a movie to watchlist
    @PostMapping("/watchlist")
    public ResponseEntity<Map<String, Object>> addToWatchlist(@RequestBody WatchlistItem item){
        String username = getCurrentUsername();

        Map<String, Object> result = reviewService.addToWatchlist(username, item);
        return ResponseEntity.ok(result);
    }

    //get watchlist for a user
    @GetMapping("/watchlist")
    public ResponseEntity<List<WatchlistItem>> getWatchlist(@RequestBody WatchlistItem item){
        String username = getCurrentUsername();
        return ResponseEntity.ok(reviewService.getWatchList(username));
    }

    //delete from watchlist
    @DeleteMapping("/watchlist/{movieId}")
    public ResponseEntity<?> removeFromWatchlist(@PathVariable Long movieId){
        String username = getCurrentUsername();
        boolean removed = reviewService.removeFromWatchlist(username, movieId);
        if(removed){
            return ResponseEntity.ok(Map.of("message", "Removed from Watchlist"));
        }
        return ResponseEntity.notFound().build();
    }

    //toggle
    @PutMapping("/watchlist/{movieId}/toggle-watched")
    public ResponseEntity<?> toggleWatched(@PathVariable Long movieId){
        String username = getCurrentUsername();
        return reviewService.toggleWatched(username, movieId)
                            .map(ResponseEntity::ok)
                            .orElse(ResponseEntity.notFound().build());
    }

    //add to favorites
    @PostMapping("/favorites")
    public ResponseEntity<Map<String, Object>> addToFavorites(@RequestBody FavoriteItem item){
        String username = getCurrentUsername();
        Map<String, Object> result = reviewService.addToFavorites(username, item);
        return ResponseEntity.ok(result);
    }

    //get all favorites
    @GetMapping("/favorites")
    public ResponseEntity<List<FavoriteItem>> getFavorites(){
        String username = getCurrentUsername();
        return ResponseEntity.ok(reviewService.getFavorites(username));
    }

    //delete from favorites
    @DeleteMapping("/favorites/{movieId}")
    public ResponseEntity<?> removeFromFavorites(@PathVariable Long movieId){
        String username = getCurrentUsername();
        boolean removed = reviewService.removeFromFavorites(username, movieId);

        if(removed){
            return ResponseEntity.ok(Map.of("message", "Removed From Favorites"));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/status/{movieId}")
    public ResponseEntity<Map<String, Boolean>> getMovieStatus(@PathVariable Long movieId){
        String username = getCurrentUsername();
        return ResponseEntity.ok(reviewService.getMovieStatus(username, movieId));
    }
}