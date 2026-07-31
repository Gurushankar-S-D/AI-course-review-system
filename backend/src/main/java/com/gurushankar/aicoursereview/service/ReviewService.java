package com.gurushankar.aicoursereview.service;

import com.gurushankar.aicoursereview.dto.ReviewRequest;
import com.gurushankar.aicoursereview.dto.ReviewResponse;

import java.util.List;

public interface ReviewService {

    // Submit a new review
    ReviewResponse addReview(ReviewRequest reviewRequest, String username);

    // Get all reviews
    List<ReviewResponse> getAllReviews();

    // Get reviews for a specific course
    List<ReviewResponse> getReviewsByCourse(Long courseId);

    // Delete a review
    void deleteReview(Long reviewId);
}