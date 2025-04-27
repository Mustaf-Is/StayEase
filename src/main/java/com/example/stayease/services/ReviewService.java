package com.example.stayease.services;
import com.example.stayease.models.Ads;
import com.example.stayease.models.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.stayease.repositories.ReviewRepository;
import com.example.stayease.models.Reviews;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public List<Reviews> getAllReviews() {
        return reviewRepository.findAllReviews();
    }
    public Reviews getReviewById(int userId, int adId) {
        return reviewRepository.findReviewById(userId, adId).orElse(null);
    }
    public Reviews createReview(Reviews review, User user, Ads ad) {
        return reviewRepository.saveReview(
                review.getComment(),
                review.getRating(),
                ad.getId(),
                user.getId()
        );
    }
    public Reviews updateReview(int userId, int adId, Reviews review) {
        Reviews existingReview = reviewRepository.findReviewById(userId, adId).orElse(null);
        if (existingReview != null) {
            existingReview.setComment(review.getComment());
            existingReview.setRating(review.getRating());
        }
        return existingReview != null ? reviewRepository.updateReview(existingReview) : null;
    }

    @Transactional
    public void deleteReview(int userId, int adId) {
        reviewRepository.deleteReviewById(userId, adId);
    }
}
