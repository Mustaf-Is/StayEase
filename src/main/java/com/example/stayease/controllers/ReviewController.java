package com.example.stayease.controllers;

import com.example.stayease.DTOs.ReviewRequestDTO;
import com.example.stayease.DTOs.ReviewResponseDTO;
import com.example.stayease.models.Ads;
import com.example.stayease.models.Reviews;
import com.example.stayease.models.User;
import com.example.stayease.repositories.AdRepository;
import com.example.stayease.repositories.UserRepository;
import com.example.stayease.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;
    private final UserRepository userRepository;
    private final AdRepository adRepository;

    @Autowired
    public ReviewController(ReviewService reviewService, UserRepository userRepository, AdRepository adRepository) {
        this.reviewService = reviewService;
        this.userRepository = userRepository;
        this.adRepository = adRepository;
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponseDTO>> getAllReviews() {
        List<Reviews> reviews = reviewService.getAllReviews();
        List<ReviewResponseDTO> responseDTOs = reviews.stream()
                .map(review -> new ReviewResponseDTO(
                        review.getComment(),
                        review.getRating(),
                        review.getAd().getId(),
                        review.getUser().getId()
                )).toList();
        return new ResponseEntity<>(responseDTOs, HttpStatus.OK);
    }

    @GetMapping("{adId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewPerAd(@PathVariable Integer adId) {
        List<Reviews> reviewsPerAd = reviewService.getReviewsPerAd(adId);
        if (reviewsPerAd != null) {
            List<ReviewResponseDTO> responseDTOs = reviewsPerAd.stream()
                    .map(review -> new ReviewResponseDTO(
                            review.getComment(),
                            review.getRating(),
                            review.getAd().getId(),
                            review.getUser().getId()
                    )).toList();

            return new ResponseEntity<>(responseDTOs, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> addReview(@RequestBody ReviewRequestDTO reviewRequestDTO) {
        Reviews review = reviewRequestDTO.review();
        Integer userId = reviewRequestDTO.userId();
        Integer adId = reviewRequestDTO.adId();
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Ads ad = adRepository.findById(adId).orElseThrow(() -> new RuntimeException("Ad not found"));
        Reviews createdReview = reviewService.createReview(review, user, ad);
        ReviewResponseDTO responseDTO = new ReviewResponseDTO(
                createdReview.getComment(),
                createdReview.getRating(),
                createdReview.getAd().getId(),
                createdReview.getUser().getId()
        );
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @PutMapping("/{userId}/{adId}")
    public ResponseEntity<ReviewResponseDTO> updateReview(@PathVariable Integer userId, @PathVariable Integer adId, @RequestBody Reviews review) {
            Reviews updatedReview = reviewService.updateReview(userId, adId, review);
            ReviewResponseDTO responseDTO = new ReviewResponseDTO(
                    updatedReview.getComment(),
                    updatedReview.getRating(),
                    updatedReview.getAd().getId(),
                    updatedReview.getUser().getId()
            );
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}/{adId}")
    public ResponseEntity<ReviewResponseDTO> deleteReview(@PathVariable Integer userId, @PathVariable Integer adId) {
        Reviews review = reviewService.getReviewById(adId, userId);
        if(review == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        reviewService.deleteReview(userId, adId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
