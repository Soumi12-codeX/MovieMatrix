package com.movie.review_service.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.movie.review_service.dto.ReviewRequest;
import com.movie.review_service.models.FavoriteItem;
import com.movie.review_service.models.Review;
import com.movie.review_service.models.WatchlistItem;
import com.movie.review_service.repository.FavoriteRepo;
import com.movie.review_service.repository.ReviewRepo;
import com.movie.review_service.repository.WatchlistRepo;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ReviewService {
    
    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private WatchlistRepo watchlistRepo;

    @Autowired
    private FavoriteRepo favoriteRepo;

    //****Review methods*****
    
    //save or update review
    public Review saveReview(String username, ReviewRequest request){
        Optional<Review> existing = reviewRepo.findByUsernameAndMovieId(username, request.getMovieId());

        Review review;
        if(existing.isPresent()){
            review = existing.get();
            review.setRating(request.getRating());
            review.setContent(request.getContent());
        }
        else{
            review = new Review();
            review.setUsername(username);
            review.setMovieId(request.getMovieId());
            review.setMovieTitle(request.getMovieTitle());
            review.setPosterPath(request.getPosterPath());
            review.setRating(request.getRating());
            review.setContent(request.getContent());
        }
        return reviewRepo.save(review);
    }

    //get all reviews of a user
    public List<Review> getUserReviews(String username){
        return reviewRepo.findByUsername(username);
    }

    //get all reviews of a movie
    public List<Review> getMovieReviews(Long movieId){
        return reviewRepo.findByMovieIdOrderByCreatedAtDesc(movieId);
    }

    //delete review
    public boolean deleteReview(String username, Long reviewId){
        Optional<Review> review = reviewRepo.findById(reviewId);

        if(review.isPresent() && review.get().getUsername().equals(username)){
            reviewRepo.deleteById(reviewId);
            return true;
        }
        return false;
    }

    //get review for a movie by a user
    public Optional<Review> getUserReviewForMovie(String username, Long movieId){
        return reviewRepo.findByUsernameAndMovieId(username, movieId);
    }

    //***Watchlist methods****

    //add a movie to watchlist
    public Map<String, Object> addToWatchlist(String username, WatchlistItem item){
        Map<String, Object> response = new HashMap<>();

        if(watchlistRepo.existsByUsernameAndMovieId(username, item.getMovieId())){
            response.put("message", "Movie already in watchlist");
            response.put("alreadyExists", true);
            return response;
        }
        item.setUsername(username);
        watchlistRepo.save(item);

        response.put("message", "Added to watchlist");
        response.put("alreadyExists", false);
        return response;
    }

    //get movies in user watchlist
    public List<WatchlistItem> getWatchList(String username){
        return watchlistRepo.findByUsernameOrderByAddedAtDesc(username);
    }

    //remove a movie from watchlist
    public boolean removeFromWatchlist(String username, Long movieId){
        if(watchlistRepo.existsByUsernameAndMovieId(username, movieId)){
            watchlistRepo.deleteByUsernameAndMovieId(username, movieId);
            return true;
        }
        return false;
    }

    //watched and unwatched toggle
    public Optional<WatchlistItem> toggleWatched(String username, Long movieId){
        Optional<WatchlistItem> item = watchlistRepo.findByUsernameAndMovieId(username, movieId);

        if(item.isPresent()){
            WatchlistItem watchlistItem = item.get();
            watchlistItem.setWatched(!watchlistItem.isWatched());
            return Optional.of(watchlistRepo.save(watchlistItem));
        }
        return Optional.empty();
    }

    //****FAVORITES METHODS******

    //add a movie to favorites
    public Map<String, Object> addToFavorites(String username, FavoriteItem item){
        
        Map<String, Object> response = new HashMap<>();
        
        if(favoriteRepo.existsByUsernameAndMovieId(username, item.getMovieId())){
            response.put("message", "Movie already in favorites");
            response.put("alreadyExists", true);
            return response;
        }
        item.setUsername(username);
        favoriteRepo.save(item);

        response.put("message", "Added to favorites");
        response.put("alreadyExists", false);
        return response;
    }

    //get all movies in user favorites
    public List<FavoriteItem> getFavorites(String username){
        return favoriteRepo.findByUsernameOrderByAddedAtDesc(username);
    }

    //remove from favorites
    public boolean removeFromFavorites(String username, Long movieId){
        if(favoriteRepo.existsByUsernameAndMovieId(username, movieId)){
            favoriteRepo.deleteByUsernameAndMovieId(username, movieId);
            return true;
        }
        return false;
    }

    //for buttons in the movie details page
    public Map<String, Boolean> getMovieStatus(String username, Long movieId){
        Map<String, Boolean> status = new HashMap<>();
        
        status.put("inWatchlist", watchlistRepo.existsByUsernameAndMovieId(username, movieId));
        
        status.put("inFvaorites", favoriteRepo.existsByUsernameAndMovieId(username, movieId));
        
        status.put("hasReviewed", reviewRepo.existsByUsernameAndMovieId(username, movieId));
        
        return status;
    }
}
