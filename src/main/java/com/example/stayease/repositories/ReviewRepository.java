package com.example.stayease.repositories;

import com.example.stayease.enums.Rating;
import com.example.stayease.models.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Reviews, Integer> {
    @Query(value = "CALL sp_find_all_reviews()", nativeQuery = true)
    List<Reviews> findAllReviews();

    @Query(value = "CALL sp_find_review_by_id(:userId, :adId)", nativeQuery = true)
    Optional<Reviews> findReviewById(@Param("userId") Integer id, @Param("adId") Integer adId);

    @Query(value = "CALL sp_save_review(:comment, :rating, :adId, :userId )", nativeQuery = true)
    Reviews saveReview(@Param("comment") String comment,
                       @Param("rating") Rating rating,
                       @Param("adId") Integer adId,
                       @Param("userId") Integer userId);

    @Query(value = "CALL sp_update_review(#{#review.userId},#{#review.adId}, :#{#review.comment}, :#{#review.rating})", nativeQuery = true)
    Reviews updateReview(@Param("review") Reviews review);

    @Procedure("stayease.sp_delete_review")
    @Transactional
    void deleteReviewById(@Param("userID") Integer userId, @Param("adId") Integer adId);
}
